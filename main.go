package main

import (
	"embed"
	"log/slog"
	"os"
	"path/filepath"
	"runtime"
	"skibidi-peek/internal/config"
	"skibidi-peek/internal/logging"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed frontend/src/assets/trayicon.png
var trayIcon []byte

//go:embed build/appicon.png
var appIcon []byte

var version = "dev"

const reportEndpoint = "https://ghost-chat-reports.marcoschuster.workers.dev"

func main() {
	if closer, err := logging.Setup(version == "dev"); err == nil {
		defer closer.Close()
	} else {
		slog.Error("failed to set up file logging", "error", err)
	}

	configPath, err := config.GetConfigPath()

	if err != nil {
		slog.Error("failed to get config path", "error", err)
		return
	}

	cfg, err := config.Load(configPath)

	if err != nil {
		slog.Error("failed to load config", "error", err)
		return
	}

	if version != "dev" {
		normalizedVersion := config.NormalizeVersion(version)

		if err := config.RunMigrations(cfg, normalizedVersion); err != nil {
			slog.Error("failed to run migrations", "error", err)
		}

		cfg.Version = normalizedVersion

		if err := config.Save(cfg, configPath); err != nil {
			slog.Error("failed to save config", "error", err)
		}
	}

	svc := NewApp(cfg, configPath, version)

	initialW, initialH := sanitizeWindowSize(cfg.WindowState.Width, cfg.WindowState.Height)

	var webviewUserDataPath string

	if runtime.GOOS == "windows" {
		if localAppData := os.Getenv("LOCALAPPDATA"); localAppData != "" {
			webviewUserDataPath = filepath.Join(localAppData, "skibidi-peek", "webview")
		}
	}

	app := application.New(application.Options{
		Name: "SkibidiPeek",
		Icon: appIcon,
		Windows: application.WindowsOptions{
			WebviewUserDataPath: webviewUserDataPath,
		},
		ShouldQuit: func() bool {
			svc.SaveWindowState()
			return true
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
		Assets: application.AssetOptions{
			Handler: application.BundledAssetFileServer(assets),
		},
		Services: []application.Service{
			application.NewService(svc),
		},
	})

	win := app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            "SkibidiPeek",
		Width:            initialW,
		Height:           initialH,
		Hidden:           true,
		Frameless:        true,
		AlwaysOnTop:      true,
		BackgroundType:   application.BackgroundTypeTransparent,
		BackgroundColour: application.NewRGBA(0, 0, 0, 0),
		Windows: application.WindowsWindow{
			DisableFramelessWindowDecorations: true,
		},
		Mac: application.MacWindow{
			Backdrop: application.MacBackdropTransparent,
		},
	})

	svc.SetApp(app, win)

	tray := app.SystemTray.New()
	tray.SetTemplateIcon(trayIcon)
	tray.SetTooltip("SkibidiPeek " + version)

	menu := app.NewMenu()
	menu.Add("SkibidiPeek " + version).SetEnabled(false)
	menu.AddSeparator()
	menu.Add("Center on Screen").OnClick(func(_ *application.Context) { svc.CenterOnScreen() })
	menu.Add("Toggle Lock").OnClick(func(_ *application.Context) { svc.ToggleLock() })
	menu.Add("Open Config Folder").OnClick(func(_ *application.Context) { svc.OpenConfigFolder() })
	menu.AddSeparator()
	menu.Add("Quit").OnClick(func(_ *application.Context) { win.Close() })

	tray.SetMenu(menu)

	if err := app.Run(); err != nil {
		slog.Error("application run failed", "error", err)
	}
}
