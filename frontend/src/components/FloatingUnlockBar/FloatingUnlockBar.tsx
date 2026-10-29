import { SetUnlockButtonBounds, ToggleLock } from '@bindings/skibidi-peek/app.js';
import { Events } from '@wailsio/runtime';
import { useEffect, useRef, useState } from 'react';

import styles from './FloatingUnlockBar.module.css';

interface FloatingUnlockBarProps {
    hotkey: string;
}

export function FloatingUnlockBar({ hotkey }: FloatingUnlockBarProps) {
    const [hovered, setHovered] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Sync button bounding box to Go backend so it knows when cursor is over it
    useEffect(() => {
        const updateBounds = () => {
            if (!buttonRef.current) {
                return;
            }
            const rect = buttonRef.current.getBoundingClientRect();
            void SetUnlockButtonBounds(
                Math.round(rect.left),
                Math.round(rect.top),
                Math.round(rect.width),
                Math.round(rect.height)
            );
        };

        updateBounds();

        window.addEventListener('resize', updateBounds);
        const observer = new ResizeObserver(updateBounds);
        if (buttonRef.current) {
            observer.observe(buttonRef.current);
        }

        return () => {
            window.removeEventListener('resize', updateBounds);
            observer.disconnect();
        };
    }, []);

    // Listen to hover event emitted by Go cursor tracker when window is click-through
    useEffect(() => {
        const cancel = Events.On('lock:hover', (ev) => {
            setHovered(Boolean(ev.data));
        });

        return () => {
            cancel();
        };
    }, []);

    return (
        <div className={styles.container}>
            <button
                ref={buttonRef}
                className={`${styles.unlockBtn} ${hovered ? styles.hovered : ''}`}
                onClick={() => void ToggleLock()}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                title={`Click here or press ${hotkey} to unlock`}
            >
                <div className={styles.lockIconWrapper}>
                    <svg
                        className={styles.lockIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <span className={styles.label}>
                    <strong>Locked</strong>
                    <span className={styles.divider}>•</span>
                    <span className={styles.actionText}>Click to Unlock</span>
                </span>
                <kbd className={styles.hotkeyBadge}>{hotkey}</kbd>
            </button>
        </div>
    );
}
