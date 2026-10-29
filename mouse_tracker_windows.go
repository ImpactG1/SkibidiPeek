//go:build windows

package main

import (
	"context"
	"time"

	"github.com/wailsapp/wails/v3/pkg/w32"
)

func (a *App) startLockTracking() {
	a.stopLockTracking()

	ctx, cancel := context.WithCancel(context.Background())
	a.lockCancel = cancel

	go func() {
		ticker := time.NewTicker(35 * time.Millisecond)
		defer ticker.Stop()

		var hoveringButton bool

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				a.configMu.Lock()
				isLocked := a.locked
				a.configMu.Unlock()

				if !isLocked {
					return
				}

				curX, curY, ok := w32.GetCursorPos()
				if !ok {
					continue
				}

				winX, winY := a.window.Position()
				winW, _ := a.window.Size()

				a.lockBoundsMu.Lock()
				relX := a.unlockBtnX
				relY := a.unlockBtnY
				btnW := a.unlockBtnW
				btnH := a.unlockBtnH
				a.lockBoundsMu.Unlock()

				if btnW <= 0 || btnH <= 0 {
					btnW = 220
					btnH = 40
					relX = (winW - btnW) / 2
					relY = 10
				}

				btnScreenX := winX + relX
				btnScreenY := winY + relY

				isOver := curX >= btnScreenX && curX <= (btnScreenX+btnW) &&
					curY >= btnScreenY && curY <= (btnScreenY+btnH)

				if isOver && !hoveringButton {
					hoveringButton = true
					a.window.SetIgnoreMouseEvents(false)
					if a.emit != nil {
						a.emit("lock:hover", true)
					}
				} else if !isOver && hoveringButton {
					hoveringButton = false
					a.window.SetIgnoreMouseEvents(true)
					if a.emit != nil {
						a.emit("lock:hover", false)
					}
				}
			}
		}
	}()
}

func (a *App) stopLockTracking() {
	if a.lockCancel != nil {
		a.lockCancel()
		a.lockCancel = nil
	}
}

