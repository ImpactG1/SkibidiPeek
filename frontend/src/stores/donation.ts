import type { DonationItem, DonationSettings } from '@/types/donation';

import { create } from 'zustand';

import { playDonationChime } from '@/utils/chime';

const SETTINGS_KEY = 'skibidipeek_donation_settings';

const defaultSettings: DonationSettings = {
    enabled: true,
    position: 'top',
    duration: 5,
    animation: 'bounce',
    soundEnabled: true,
    soundVolume: 80,
};

function loadSettings(): DonationSettings {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
            return { ...defaultSettings, ...JSON.parse(raw) };
        }
    } catch {
        // Fall back to defaults
    }
    return defaultSettings;
}

interface DonationState {
    queue: DonationItem[];
    activeDonation: DonationItem | null;
    settings: DonationSettings;
    pushDonation: (item: DonationItem) => void;
    dismissActive: () => void;
    updateSettings: (partial: Partial<DonationSettings>) => void;
    clearQueue: () => void;
}

export const useDonationStore = create<DonationState>((set, get) => ({
    queue: [],
    activeDonation: null,
    settings: loadSettings(),

    pushDonation: (item) => {
        const { settings, activeDonation, queue } = get();
        if (!settings.enabled) {
            return;
        }

        if (!activeDonation) {
            set({ activeDonation: item });
            if (settings.soundEnabled) {
                playDonationChime(settings.soundVolume / 100);
            }
        } else {
            set({ queue: [...queue, item] });
        }
    },

    dismissActive: () => {
        const { queue, settings } = get();
        if (queue.length > 0) {
            const [next, ...rest] = queue;
            set({ activeDonation: next, queue: rest });
            if (settings.soundEnabled) {
                playDonationChime(settings.soundVolume / 100);
            }
        } else {
            set({ activeDonation: null });
        }
    },

    updateSettings: (partial) => {
        set((s) => {
            const next = { ...s.settings, ...partial };
            try {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
            } catch {
                // Ignore storage errors
            }
            return { settings: next };
        });
    },

    clearQueue: () => set({ queue: [], activeDonation: null }),
}));
