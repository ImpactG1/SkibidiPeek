<p align="center">
  <img src="frontend/src/assets/skibidipeek.svg" alt="SkibidiPeek" width="128" />
</p>

<h1 align="center">SkibidiPeek</h1>

<p align="center">
  <strong>Lightweight, click-through YouTube Live chat overlay for single-monitor streamers.</strong>
</p>

<p align="center">
  Always on top &bull; Click-through lock mode &bull; Super Chat pop-ups &bull; Customizable themes & animations
</p>

---

## What is SkibidiPeek?

SkibidiPeek is built specifically for streamers who only have one monitor. Paste a YouTube live stream link or video ID, and your chat floats directly above your games and desktop.

### Key Features
- **YouTube First**: Supports full watch URLs, short links (`youtu.be`), live channel URLs (`youtube.com/live/...`), popout URLs (`youtube.com/live_chat?v=...`), or bare 11-character video IDs.
- **Always on Top**: Persistent window overlay that stays above other windows and automatically re-asserts always-on-top when focus is lost.
- **Lock / Unlock Mode**:
  - **Unlocked**: Move, resize, access settings and control bar.
  - **Locked**: Fully transparent and click-through (`Ctrl+Shift+L` global hotkey or tray menu toggle). Mouse clicks pass through directly to games or underlying apps.
  - Brief visual indicator toast confirms state changes.
- **Donation & Super Chat Pop-ups**: Detects paid messages, stickers, and memberships with customizable pop-up cards, sound, and a test button.
- **Rich Themes & Animations**: Built-in themes (Default, Compact, Bubble, Neon, Retro Terminal, Glass, Meme/Skibidi), entrance/exit animations, independent background & text opacity, and live preview editor.
- **Ultra-low Resource Usage**: Native Go + Wails v3 + React architecture designed to idle under 2% CPU.

---

## Fullscreen & Display Guidance

> [!IMPORTANT]
> **Borderless Windowed Mode Required for Games**
> SkibidiPeek uses native Desktop Window Manager (DWM) compositing with transparency and pass-through.
> - **Borderless Windowed** / **Windowed**: Fully supported. Chat floats seamlessly over your game, and clicks pass right through to your game controls when Locked.
> - **Exclusive Fullscreen**: Direct3D/Vulkan exclusive fullscreen bypasses the Windows desktop compositor, hiding all desktop overlay windows. Set your game to "Borderless" or "Borderless Windowed" in display settings.

---

## Global Hotkeys & Controls

- **Toggle Lock Mode**: `Ctrl+Shift+L` (configurable in Settings &bull; General)
- **Tray Menu**: Right-click the SkibidiPeek tray icon to toggle lock, center on screen, open the config folder, or quit.

---

## Development & Building

### Prerequisites
- Go 1.25+ (configured in `D:\go`)
- Node.js 20+ and pnpm
- Wails v3 CLI (`github.com/wailsapp/wails/v3/cmd/wails3@v3.0.0-beta.27`)

### Commands
```bash
# Run dev mode with hot reload
wails3 dev

# Run Go tests
go test ./...

# Frontend checks (oxlint, oxfmt, vitest, tsc)
cd frontend && pnpm fix
cd frontend && pnpm test
cd frontend && pnpm build

# Build production binary
go build -o bin/skibidi-peek.exe .
```

---

## Notices and Attribution

SkibidiPeek is forked and remodeled from open-source projects:

1. **Ghost Chat** (Base Project)
   - Created by [Marco Schuster](https://github.com/Enubia/ghost-chat)
   - Licensed under the Don't Be A Dick Public License (DBAD v1.2)
   - Provided the foundational Go + Wails v3 overlay framework, window transparency,
     global hotkeys, and base chat ingestion clients.

2. **Live Chat Overlay** (Reference Architecture)
   - Created by [Aaron Parecki](https://github.com/aaronpk/live-chat-overlay), with initial concepts by ROJ BTS.
   - Provided reference architecture for detecting YouTube Super Chats, Super Stickers,
     membership milestones, tier styling, and overlay presentation logic.

See [NOTICE.md](NOTICE.md) for full attribution details.
