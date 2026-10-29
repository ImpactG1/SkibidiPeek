export type DonationType = 'superchat' | 'sticker' | 'membership' | 'gift';

export interface DonationItem {
    id: string;
    type: DonationType;
    username: string;
    avatar?: string;
    amount?: string;
    headerColor?: string;
    bodyColor?: string;
    message?: string;
    stickerUrl?: string;
    timestamp: number;
}

export type DonationPosition = 'top' | 'center' | 'bottom';
export type DonationAnimation = 'bounce' | 'slide' | 'fade' | 'pop';

export interface DonationSettings {
    enabled: boolean;
    position: DonationPosition;
    duration: number; // in seconds
    animation: DonationAnimation;
    soundEnabled: boolean;
    soundVolume: number; // 0 to 100
}

