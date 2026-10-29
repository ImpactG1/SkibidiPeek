package config

import (
	"encoding/json"
	"errors"
	"log/slog"
	"os"
	"path/filepath"
)

const (
	AppName        = "skibidi-peek"
	LegacyAppName  = "ghost-chat"
	ConfigFileName = "config.json"
)

func GetConfigPath() (string, error) {
	userConfigDir, err := os.UserConfigDir()

	if err != nil {
		return "", err
	}

	return filepath.Join(userConfigDir, AppName, ConfigFileName), nil
}

func Load(path string) (*Config, error) {
	bytes, err := os.ReadFile(path)

	if errors.Is(err, os.ErrNotExist) {
		// Check for legacy Ghost Chat config
		legacyPath := filepath.Join(filepath.Dir(filepath.Dir(path)), LegacyAppName, ConfigFileName)
		if legacyBytes, legacyErr := os.ReadFile(legacyPath); legacyErr == nil {
			slog.Info("found legacy ghost-chat config, migrating...", "path", legacyPath)
			config := DefaultConfig()
			if jsonErr := json.Unmarshal(legacyBytes, &config); jsonErr == nil {
				// Migrate vanish keybind to lock if present
				if config.Keybinds.Lock.Keybind == "" && config.Keybinds.Vanish.Keybind != "" {
					config.Keybinds.Lock.Keybind = config.Keybinds.Vanish.Keybind
				}
				if config.Keybinds.Lock.Keybind == "" {
					config.Keybinds.Lock.Keybind = "Ctrl+Shift+L"
				}
				_ = Save(&config, path)
				return &config, nil
			}
		}

		defaultConfig := DefaultConfig()
		return &defaultConfig, nil
	}

	if err != nil {
		return nil, err
	}

	// Detect v3 config (camelCase keys like "savedWindowState", "options")
	var raw map[string]json.RawMessage

	if err = json.Unmarshal(bytes, &raw); err != nil {
		return recoverCorrupted(path, bytes, err)
	}

	if _, hasV3Key := raw["savedWindowState"]; hasV3Key {
		defaultConfig := DefaultConfig()
		return &defaultConfig, nil
	}

	config := DefaultConfig()

	if err = json.Unmarshal(bytes, &config); err != nil {
		return recoverCorrupted(path, bytes, err)
	}

	// Ensure lock keybind default
	if config.Keybinds.Lock.Keybind == "" {
		if config.Keybinds.Vanish.Keybind != "" {
			config.Keybinds.Lock.Keybind = config.Keybinds.Vanish.Keybind
		} else {
			config.Keybinds.Lock.Keybind = "Ctrl+Shift+L"
		}
	}

	return &config, nil
}

func recoverCorrupted(path string, bytes []byte, err error) (*Config, error) {
	slog.Warn("config file is corrupted, backing up and starting fresh", "error", err)

	_ = os.WriteFile(path+".corrupted", bytes, 0644)
	_ = os.Remove(path)

	defaultConfig := DefaultConfig()

	return &defaultConfig, nil
}

func Save(config *Config, path string) error {
	bytes, err := json.MarshalIndent(config, "", "  ")

	if err != nil {
		return err
	}

	if err = os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return err
	}

	tempPath := path + ".tmp"

	f, err := os.OpenFile(tempPath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)

	if err != nil {
		return err
	}

	defer func() {
		f.Close()

		_ = os.Remove(tempPath)
	}()

	if _, err = f.Write(bytes); err != nil {
		return err
	}

	if err = f.Sync(); err != nil {
		return err
	}

	if err = f.Close(); err != nil {
		return err
	}

	return os.Rename(tempPath, path)
}
