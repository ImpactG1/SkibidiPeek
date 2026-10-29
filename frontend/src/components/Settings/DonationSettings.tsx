import type { DonationAnimation, DonationPosition } from '@/types/donation';

import { TriggerTestDonation } from '@bindings/skibidi-peek/app.js';
import { useState } from 'react';

import { useDonationStore } from '@/stores/donation';

import styles from './DonationSettings.module.css';

export function DonationSettings() {
    const { enabled, position, duration, animation, soundEnabled, soundVolume } = useDonationStore((s) => s.settings);
    const updateSettings = useDonationStore((s) => s.updateSettings);
    const pushDonation = useDonationStore((s) => s.pushDonation);
    const [testCount, setTestCount] = useState(0);

    const handleTestDonation = async () => {
        setTestCount((c) => c + 1);

        // Try Go backend test donation first, with fallback to frontend local test
        try {
            await TriggerTestDonation();
        } catch {
            const tiers = [
                { amount: '$5.00', header: '#1565C0', body: '#0D47A1' },
                { amount: '$10.00', header: '#FFB300', body: '#FF8F00' },
                { amount: '$20.00', header: '#E65100', body: '#BF360C' },
                { amount: '$50.00', header: '#D50000', body: '#B71C1C' },
            ];
            const tier = tiers[testCount % tiers.length];

            pushDonation({
                id: `test-${Date.now()}`,
                type: 'superchat',
                username: `SkibidiFan_${Math.floor(100 + Math.random() * 900)}`,
                amount: tier.amount,
                headerColor: tier.header,
                bodyColor: tier.body,
                message: 'Loving the stream! Keep the Skibidi vibe going! 🚀✨',
                timestamp: Date.now(),
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div>
                    <h3 className={styles.title}>Donations & Super Chats</h3>
                    <p className={styles.subtitle}>
                        Animated pop-up cards and sound chimes for YouTube Super Chats, Stickers, and Memberships.
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => void handleTestDonation()}
                    title="Send a sample Super Chat alert to test animation and sound"
                >
                    🎉 Test Donation
                </button>
            </div>

            <div className={styles.section}>
                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Enable Donation Alerts</span>
                        <p className={styles.hint}>Show animated cards when viewers donate or join.</p>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => updateSettings({ enabled: e.target.checked })}
                        />
                        <span className="toggle-slider" />
                    </label>
                </div>

                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Screen Position</span>
                        <p className={styles.hint}>Where the pop-up appears on your chat overlay.</p>
                    </div>
                    <select
                        className={styles.select}
                        value={position}
                        onChange={(e) => updateSettings({ position: e.target.value as DonationPosition })}
                    >
                        <option value="top">Top</option>
                        <option value="center">Center</option>
                        <option value="bottom">Bottom</option>
                    </select>
                </div>

                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Entrance Animation</span>
                        <p className={styles.hint}>Style of motion when an alert appears.</p>
                    </div>
                    <select
                        className={styles.select}
                        value={animation}
                        onChange={(e) => updateSettings({ animation: e.target.value as DonationAnimation })}
                    >
                        <option value="bounce">Bounce (Energetic)</option>
                        <option value="slide">Slide (Smooth)</option>
                        <option value="pop">Pop (Punchy)</option>
                        <option value="fade">Fade (Gentle)</option>
                    </select>
                </div>

                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Alert Duration</span>
                        <p className={styles.hint}>How long each donation stays on screen before the next.</p>
                    </div>
                    <div className={styles.sliderWrapper}>
                        <input
                            type="range"
                            min="2"
                            max="20"
                            step="1"
                            value={duration}
                            onChange={(e) => updateSettings({ duration: Number(e.target.value) })}
                            className={styles.slider}
                        />
                        <span className={styles.valueBadge}>{duration}s</span>
                    </div>
                </div>

                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Sound Chime</span>
                        <p className={styles.hint}>Play a synthesizer chime when a donation arrives.</p>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                        />
                        <span className="toggle-slider" />
                    </label>
                </div>

                {soundEnabled && (
                    <div className={styles.row}>
                        <div>
                            <span className={styles.label}>Chime Volume</span>
                            <p className={styles.hint}>Volume of the alert sound effect.</p>
                        </div>
                        <div className={styles.sliderWrapper}>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={soundVolume}
                                onChange={(e) => updateSettings({ soundVolume: Number(e.target.value) })}
                                className={styles.slider}
                            />
                            <span className={styles.valueBadge}>{soundVolume}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
