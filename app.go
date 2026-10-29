package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"sync"
	"time"

	"skibidi-peek/internal/auth"
	"skibidi-peek/internal/bugreport"
	"skibidi-peek/internal/chat"
	"skibidi-peek/internal/chat/kick"
	"skibidi-peek/internal/chat/twitch"
	"skibidi-peek/internal/chat/youtube"
	"skibidi-peek/internal/config"
	ghHotkey "skibidi-peek/internal/hotkey"
	"skibidi-peek/internal/updater"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/events"
)

type App struct {
	app              *application.App
	window           *application.WebviewWindow
	config           *config.Config
	configMu         sync.Mutex
	configPath       string
	auth             *auth.Manager
	clients          map[chat.Platform]chat.Client
	redemptions      *twitch.EventSub
	redemptionsMu    sync.Mutex
	twitchChannel    string
	authMu           sync.Mutex
	authLoginPending bool
	emit             func(event string, data any)
	version          string
	preExpandWidth   int
	vanished         bool
	locked           bool
	lastX, lastY     int
	lastW, lastH     int
	platforms        bugreport.PlatformTracker
}

func NewApp(cfg *config.Config, configPath string, version string) *App {
	a := &App{
		config:     cfg,
		configPath: configPath,
		auth:       auth.NewManager(auth.NewKeychainTokenStore()),
		version:    version,
		locked:     cfg.WindowState.Locked,
		vanished:   cfg.WindowState.Locked,
		lastX:      cfg.WindowState.X,
		lastY:      cfg.WindowState.Y,
		lastW:      cfg.WindowState.Width,
		lastH:      cfg.WindowState.Height,
	}

	onMessage := func(msg chat.ChatMessage) {
		if a.emit != nil {
			a.emit("chat:message", msg)
		}
	}

	a.redemptions = twitch.NewEventSub(onMessage, twitchAuthAdapter{m: a.auth}, a.handleRedemptionAuthLost)

	return a
}

func (a *App) SetApp(app *application.App, win *application.WebviewWindow) {
	a.app = app
	a.window = win

	a.emit = func(event string, data any) {
		a.app.Event.Emit(event, data)
	}

	a.wireClients()
}

func makeHandlers(emit func(string, any)) (func(chat.ChatMessage), func(string, any)) {
	onMessage := func(msg chat.ChatMessage) {
		emit("chat:message", msg)
	}
	onEvent := func(event string, data any) {
		emit(event, data)
	}

	return onMessage, onEvent
}

func (a *App) wireClients() {
	onMessage, emitEvent := makeHandlers(a.emit)

	onEvent := func(event string, data any) {
		a.platforms.Observe(event, data)
		emitEvent(event, data)
	}

	a.clients = map[chat.Platform]chat.Client{
		chat.PlatformTwitch:  twitch.NewClient(onMessage, onEvent),
		chat.PlatformYouTube: youtube.NewClient(onMessage, onEvent),
		chat.PlatformKick:    kick.NewClient(onMessage, onEvent),
	}
}

func (a *App) ServiceStartup(ctx context.Context, options application.ServiceOptions) error {
	a.window.OnWindowEvent(events.Common.WindowRuntimeReady, func(e *application.WindowEvent) {
		w, h := sanitizeWindowSize(a.config.WindowState.Width, a.config.WindowState.Height)

		if runtime.GOOS == "windows" {
			a.window.SetSize(w, h)
		}

		x, y := a.config.WindowState.X, a.config.WindowState.Y

		unset := x == 0 && y == 0

		if unset || !positionVisible(screenWorkAreas(a.app.Screen.GetAll()), x, y, w, h) {
			x, y = a.centeredPosition(w, h)
		}

		a.window.SetPosition(x, y)
		a.window.SetAlwaysOnTop(true)
		a.window.Show()

		if a.locked {
			a.window.SetIgnoreMouseEvents(true)
			a.app.Event.Emit("lock:toggle", true)
			a.app.Event.Emit("vanish:toggle", true)
		}

		go func() {
			info, err := updater.CheckForUpdate(a.version)

			if err != nil || info == nil {
				return
			}

			a.app.Event.Emit("update:available", info)
		}()
	})

	a.window.OnWindowEvent(events.Common.WindowDidMove, func(e *application.WindowEvent) {
		a.lastX, a.lastY = a.window.Position()
	})

	a.window.OnWindowEvent(events.Common.WindowDidResize, func(e *application.WindowEvent) {
		a.lastW, a.lastH = a.window.Size()
	})

	// Re-assert always on top when focus is lost or changed
	a.window.OnWindowEvent(events.Common.WindowLostFocus, func(e *application.WindowEvent) {
		a.window.SetAlwaysOnTop(true)
	})

	go func() {
		keybind := a.config.Keybinds.Lock.Keybind
		if keybind == "" {
			keybind = a.config.Keybinds.Vanish.Keybind
		}
		if keybind == "" {
			keybind = "Ctrl+Shift+L"
		}
		if err := ghHotkey.Register(keybind, a.ToggleLock); err != nil {
			slog.Error("failed to register lock hotkey", "error", err, "keybind", keybind)
		}
	}()

	go a.restoreTwitchAuth()

	return nil
}

func (a *App) SaveWindowState() {
	a.configMu.Lock()
	defer a.configMu.Unlock()

	a.config.WindowState.X = a.lastX
	a.config.WindowState.Y = a.lastY

	if a.preExpandWidth > 0 {
		a.config.WindowState.Width = a.preExpandWidth
	} else {
		a.config.WindowState.Width = a.lastW
	}

	a.config.WindowState.Height = a.lastH
	a.config.WindowState.Locked = a.locked

	if err := config.Save(a.config, a.configPath); err != nil {
		slog.Error("failed to save config", "error", err)
	}
}

func (a *App) ServiceShutdown() error {
	a.SaveWindowState()

	go func() {
		for _, c := range a.clients {
			c.Disconnect()
		}

		if a.redemptions != nil {
			a.redemptions.Stop()
		}

		ghHotkey.Unregister()
	}()

	return nil
}

func (a *App) GetConfig() *config.Config {
	a.configMu.Lock()
	defer a.configMu.Unlock()

	return a.config
}

func (a *App) UpdateConfig(cfg *config.Config) error {
	a.configMu.Lock()

	oldConfig := a.config
	oldKeybind := a.config.Keybinds.Lock.Keybind
	if oldKeybind == "" {
		oldKeybind = a.config.Keybinds.Vanish.Keybind
	}
	account := a.config.Twitch.Account
	installID := a.config.InstallID

	a.config = cfg
	a.config.Twitch.Account = account
	a.config.InstallID = installID

	if err := config.Save(a.config, a.configPath); err != nil {
		a.config = oldConfig
		a.configMu.Unlock()
		return err
	}

	newKeybind := cfg.Keybinds.Lock.Keybind
	if newKeybind == "" {
		newKeybind = cfg.Keybinds.Vanish.Keybind
	}

	a.configMu.Unlock()

	if newKeybind != oldKeybind && newKeybind != "" {
		if err := ghHotkey.Register(newKeybind, a.ToggleLock); err != nil {
			slog.Error("failed to register lock hotkey", "error", err)
		}
	}

	return nil
}

func (a *App) Connect(platform chat.Platform, input string) error {
	c, ok := a.clients[platform]

	if !ok {
		return fmt.Errorf("unknown platform: %s", platform)
	}

	if err := c.Connect(input); err != nil {
		return err
	}

	if platform == chat.PlatformTwitch {
		a.setTwitchChannel(input)
	}

	return nil
}

func (a *App) Disconnect(platform chat.Platform) error {
	c, ok := a.clients[platform]

	if !ok {
		return fmt.Errorf("unknown platform: %s", platform)
	}

	c.Disconnect()

	if platform == chat.PlatformTwitch {
		a.clearTwitchChannel()
	}

	return nil
}

func (a *App) ResolveYouTubeVideo(input string) (string, error) {
	return youtube.ResolveVideoURL(input)
}

func (a *App) ExpandForSettings() {
	w, h := a.window.Size()
	a.preExpandWidth = w

	a.window.SetSize(1000, h)
}

func (a *App) ShrinkToChat() {
	_, h := a.window.Size()
	width := a.preExpandWidth

	if width == 0 {
		width = a.config.WindowState.Width
	}

	a.window.SetSize(width, h)
}

func (a *App) ToggleLock() {
	a.configMu.Lock()
	a.locked = !a.locked
	locked := a.locked
	a.vanished = locked
	a.config.WindowState.Locked = locked
	_ = config.Save(a.config, a.configPath)
	a.configMu.Unlock()

	a.app.Event.Emit("lock:toggle", locked)
	a.app.Event.Emit("vanish:toggle", locked)

	if locked {
		a.window.SetIgnoreMouseEvents(true)
	} else {
		a.window.SetIgnoreMouseEvents(false)
	}
}

func (a *App) ToggleVanish() {
	a.ToggleLock()
}

func (a *App) TriggerTestDonation() {
	testDonation := chat.ChatMessage{
		ID:        fmt.Sprintf("test-donation-%d", os.Getpid()),
		Platform:  chat.PlatformYouTube,
		Username:  "SkibidiDonator",
		Avatar:    "https://lh3.googleusercontent.com/a/default-user",
		Timestamp: time.Now(),
		Text:      "Here's a Super Chat! Loving the stream! ✨",
		SuperChat: &chat.SuperChatDetails{
			Amount:      "$20.00",
			HeaderColor: "#E62117",
			BodyColor:   "#D00000",
		},
		Fragments: []chat.MessageFragment{
			{Type: chat.FragmentText, Text: "Here's a Super Chat! Loving the stream! ✨"},
		},
	}
	if a.emit != nil {
		a.emit("chat:message", testDonation)
		a.emit("chat:donation", testDonation)
	}
}

func (a *App) centeredPosition(w, h int) (int, int) {
	primary := a.app.Screen.GetPrimary()

	if primary == nil {
		return 0, 0
	}

	return centerInWorkArea(primary.WorkArea, w, h)
}

func (a *App) CenterOnScreen() {
	w, h := a.window.Size()
	x, y := a.centeredPosition(w, h)

	a.window.SetPosition(x, y)
	a.window.SetAlwaysOnTop(true)
	a.window.Show()
	a.window.Focus()
}

func (a *App) OpenConfigFolder() {
	dir := filepath.Dir(a.configPath)

	switch runtime.GOOS {
	case "darwin":
		exec.Command("open", dir).Start()
	case "windows":
		exec.Command("explorer", dir).Start()
	}
}

func (a *App) ExportTheme(filename string, content string) error {
	dialog := a.app.Dialog.SaveFile()

	dialog.SetFilename(filename)
	dialog.AddFilter("JSON", "*.json")
	dialog.CanCreateDirectories(true)
	dialog.AttachToWindow(a.window)

	path, err := dialog.PromptForSingleSelection()
	if err != nil {
		return fmt.Errorf("save dialog failed: %w", err)
	}

	if path == "" {
		return nil
	}

	return os.WriteFile(path, []byte(content), 0o644)
}
