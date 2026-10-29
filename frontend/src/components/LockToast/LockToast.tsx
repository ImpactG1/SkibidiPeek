import { useEffect, useState } from 'react';

import styles from './LockToast.module.css';

interface LockToastProps {
    locked: boolean | null;
    hotkeyHint?: string;
}

export function LockToast({ locked, hotkeyHint = 'Ctrl+Shift+L' }: LockToastProps) {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [currentLocked, setCurrentLocked] = useState<boolean | null>(null);

    useEffect(() => {
        if (locked === null) {
            return;
        }

        setCurrentLocked(locked);
        setVisible(true);
        setClosing(false);

        const closeTimer = setTimeout(() => {
            setClosing(true);
        }, 1800);

        const hideTimer = setTimeout(() => {
            setVisible(false);
            setClosing(false);
        }, 2200);

        return () => {
            clearTimeout(closeTimer);
            clearTimeout(hideTimer);
        };
    }, [locked]);

    if (!visible || currentLocked === null) {
        return null;
    }

    return (
        <div className={`${styles.toastContainer} ${closing ? styles.closing : ''}`}>
            <div className={`${styles.card} ${currentLocked ? styles.locked : styles.unlocked}`}>
                <div className={styles.header}>
                    <span className={styles.icon}>{currentLocked ? '🔒' : '🔓'}</span>
                    <span>{currentLocked ? 'Locked (Click-Through)' : 'Unlocked (Interactive)'}</span>
                </div>
                <span className={styles.hotkey}>
                    {currentLocked ? `Press ${hotkeyHint} to unlock` : `Press ${hotkeyHint} to lock`}
                </span>
            </div>
        </div>
    );
}
