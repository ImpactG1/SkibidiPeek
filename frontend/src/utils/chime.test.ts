import { describe, expect, it } from 'vitest';

import { playDonationChime } from './chime';

describe('playDonationChime', () => {
    it('executes safely in node/jsdom without throwing', () => {
        expect(() => playDonationChime(0.5)).not.toThrow();
        expect(() => playDonationChime(0)).not.toThrow();
        expect(() => playDonationChime(1)).not.toThrow();
    });
});

