import { useEffect, useState } from 'react';

import { useDonationStore } from '@/stores/donation';

import styles from './DonationOverlay.module.css';

export function DonationOverlay() {
    const activeDonation = useDonationStore((s) => s.activeDonation);
    const dismissActive = useDonationStore((s) => s.dismissActive);
    const { position, duration, animation } = useDonationStore((s) => s.settings);
    const queueLength = useDonationStore((s) => s.queue.length);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!activeDonation) {
            return;
        }

        setProgress(100);
        const startTime = Date.now();
        const durationMs = duration * 1000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100);
            setProgress(remaining);

            if (elapsed >= durationMs) {
                clearInterval(interval);
                dismissActive();
            }
        }, 30);

        return () => {
            clearInterval(interval);
        };
    }, [activeDonation, duration, dismissActive]);

    if (!activeDonation) {
        return null;
    }

    const badgeText =
        activeDonation.type === 'sticker'
            ? 'SUPER STICKER'
            : activeDonation.type === 'membership'
              ? 'NEW MEMBER'
              : activeDonation.type === 'gift'
                ? 'MEMBERSHIP GIFT'
                : 'SUPER CHAT';

    const headerBg = activeDonation.headerColor || '#e62117';
    const bodyBg = activeDonation.bodyColor || '#232532';

    return (
        <div className={`${styles.overlayWrapper} ${styles[position]}`}>
            <div
                className={`${styles.card} ${styles[animation]}`}
                style={{
                    backgroundColor: bodyBg,
                    borderTopColor: headerBg,
                }}
            >
                {/* Header Banner */}
                <div
                    className={styles.header}
                    style={{ backgroundColor: headerBg }}
                >
                    <div className={styles.badgeRow}>
                        <span className={styles.badge}>{badgeText}</span>
                        {queueLength > 0 && <span className={styles.queueCount}>+{queueLength} in queue</span>}
                    </div>
                    {activeDonation.amount && <span className={styles.amount}>{activeDonation.amount}</span>}
                </div>

                {/* Content Body */}
                <div className={styles.body}>
                    <div className={styles.userRow}>
                        {activeDonation.avatar ? (
                            <img
                                src={activeDonation.avatar}
                                alt={activeDonation.username}
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {activeDonation.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className={styles.username}>{activeDonation.username}</span>
                        <button
                            className={styles.skipBtn}
                            onClick={() => dismissActive()}
                            title="Dismiss alert"
                        >
                            ✕
                        </button>
                    </div>

                    {activeDonation.message && <p className={styles.message}>{activeDonation.message}</p>}

                    {activeDonation.stickerUrl && (
                        <div className={styles.stickerContainer}>
                            <img
                                src={activeDonation.stickerUrl}
                                alt="Super Sticker"
                                className={styles.stickerImage}
                            />
                        </div>
                    )}
                </div>

                {/* Duration Progress Bar */}
                <div className={styles.progressBarTrack}>
                    <div
                        className={styles.progressBarFill}
                        style={{
                            width: `${progress}%`,
                            backgroundColor: headerBg,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
