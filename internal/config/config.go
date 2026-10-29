package config

type WindowState struct {
	X      int  `json:"x"`
	Y      int  `json:"y"`
	Width  int  `json:"width"`
	Height int  `json:"height"`
	Locked bool `json:"locked"`
}

type General struct {
	Language           string  `json:"language"` // default "en-US"
	ShowTimestamps     bool    `json:"show_timestamps"`
	ShowWaitingMessage bool    `json:"show_waiting_message"`
	BackgroundOpacity  float64 `json:"background_opacity"` // 0.0 - 1.0 (default 1.0 or theme-driven)
	TextOpacity        float64 `json:"text_opacity"`       // 0.0 - 1.0 (default 1.0)
	ReduceMotion       bool    `json:"reduce_motion"`
}

type LockKeybind struct {
	Keybind string `json:"keybind"` // default "Ctrl+Shift+L"
}

type Keybinds struct {
	Lock   LockKeybind `json:"lock"`
	Vanish LockKeybind `json:"vanish,omitempty"`
}

type TwitchEvents struct {
	Subscriptions bool `json:"subscriptions"`
	Raids         bool `json:"raids"`
	Announcements bool `json:"announcements"`
	Redemptions   bool `json:"redemptions"`
	Other         bool `json:"other"`
}

type TwitchAccount struct {
	Login string `json:"login"`
}

type TwitchConfig struct {
	DefaultChannel string        `json:"default_channel"`
	Fade           bool          `json:"fade"`
	FadeTimeout    int           `json:"fade_timeout"`
	Bots           bool          `json:"bots"`
	HideCommands   bool          `json:"hide_commands"`
	HideBadges     bool          `json:"hide_badges"`
	HideGifs       bool          `json:"hide_gifs"`
	UserBlacklist  []string      `json:"user_blacklist"`
	Events         TwitchEvents  `json:"events"`
	Account        TwitchAccount `json:"account"`
}

type YouTubeConfig struct {
	ChannelID     string   `json:"channel_id"`
	VideoURL      string   `json:"video_url"`
	Fade          bool     `json:"fade"`
	FadeTimeout   int      `json:"fade_timeout"`
	UserBlacklist []string `json:"user_blacklist"`
}

type KickConfig struct {
	DefaultChannel string   `json:"default_channel"`
	Fade           bool     `json:"fade"`
	FadeTimeout    int      `json:"fade_timeout"`
	UserBlacklist  []string `json:"user_blacklist"`
}

type Theme struct {
	ID              string  `json:"id"`
	Name            string  `json:"name"`
	FontFamily      string  `json:"font_family"`
	FontSize        int     `json:"font_size"`
	LineHeight      float64 `json:"line_height"`
	MessageBg       string  `json:"message_bg"`
	MessagePadding  string  `json:"message_padding"`
	MessageRadius   int     `json:"message_radius"`
	MessageGap      int     `json:"message_gap"`
	UsernameWeight  int     `json:"username_weight"`
	ShowColon       bool    `json:"show_colon"`
	BadgeSize       int     `json:"badge_size"`
	EmoteSize       int     `json:"emote_size"`
	GifSize         int     `json:"gif_size"`
	ShowAvatars     bool    `json:"show_avatars"`
	AvatarSize      int     `json:"avatar_size"`
	TextWeight      int     `json:"text_weight"`
	TextShadow      string  `json:"text_shadow"`
	TextColor       string  `json:"text_color"`
	TextStrokeWidth float64 `json:"text_stroke_width"`
	TextStrokeColor string  `json:"text_stroke_color"`
	TopToBottom     bool    `json:"top_to_bottom"`
	Animation       string  `json:"animation,omitempty"` // entrance animation name
	MaxMessages     int     `json:"max_messages,omitempty"`
}

type ThemeConfig struct {
	ActiveThemeID string  `json:"active_theme_id"`
	CustomThemes  []Theme `json:"custom_themes"`
}

type DonationConfig struct {
	Enabled      bool   `json:"enabled"`
	Position     string `json:"position"` // "top", "center", "bottom"
	Duration     int    `json:"duration"` // in seconds
	SoundEnabled bool   `json:"sound_enabled"`
	Animation    string `json:"animation"` // "bounce", "pop", "slide", etc.
}

type CustomSource struct {
	URL string `json:"url"`
}

type Config struct {
	Version      string         `json:"version"`
	InstallID    string         `json:"install_id"`
	WindowState  WindowState    `json:"window_state"`
	General      General        `json:"general"`
	Keybinds     Keybinds       `json:"keybinds"`
	Theme        ThemeConfig    `json:"theme"`
	Donation     DonationConfig `json:"donation"`
	Twitch       TwitchConfig   `json:"twitch"`
	YouTube      YouTubeConfig  `json:"youtube"`
	Kick         KickConfig     `json:"kick"`
	CustomSource CustomSource   `json:"custom_source"`
}

func DefaultConfig() Config {
	return Config{
		WindowState: WindowState{
			Width:  400,
			Height: 600,
			Locked: false,
		},
		General: General{
			Language:           "en-US",
			ShowWaitingMessage: true,
			BackgroundOpacity:  1.0,
			TextOpacity:        1.0,
		},
		Keybinds: Keybinds{
			Lock: LockKeybind{
				Keybind: "Ctrl+Shift+L",
			},
			Vanish: LockKeybind{
				Keybind: "Ctrl+Shift+L",
			},
		},
		Theme: ThemeConfig{
			ActiveThemeID: "default",
		},
		Donation: DonationConfig{
			Enabled:      true,
			Position:     "top",
			Duration:     8,
			SoundEnabled: true,
			Animation:    "bounce",
		},
		Twitch: TwitchConfig{
			FadeTimeout: 30,
			Events: TwitchEvents{
				Subscriptions: true,
				Raids:         true,
				Announcements: true,
				Redemptions:   true,
				Other:         true,
			},
		},
		YouTube: YouTubeConfig{
			FadeTimeout: 30,
		},
		Kick: KickConfig{
			FadeTimeout: 30,
		},
	}
}
