import { beforeEach, describe, expect, it } from 'vitest';

import { useDonationStore } from './donation';

describe('useDonationStore', () => {
    beforeEach(() => {
        useDonationStore.getState().clearQueue();
    });

    it('sets first donation as active immediately', () => {
        const item = {
            id: 'd1',
            type: 'superchat' as const,
            username: 'Alpha',
            amount: '$10.00',
            timestamp: Date.now(),
        };

        useDonationStore.getState().pushDonation(item);
        expect(useDonationStore.getState().activeDonation?.id).toBe('d1');
        expect(useDonationStore.getState().queue).toHaveLength(0);
    });

    it('queues subsequent donations when one is already active', () => {
        const item1 = { id: 'd1', type: 'superchat' as const, username: 'Alpha', timestamp: 1 };
        const item2 = { id: 'd2', type: 'superchat' as const, username: 'Beta', timestamp: 2 };

        useDonationStore.getState().pushDonation(item1);
        useDonationStore.getState().pushDonation(item2);

        expect(useDonationStore.getState().activeDonation?.id).toBe('d1');
        expect(useDonationStore.getState().queue).toHaveLength(1);
        expect(useDonationStore.getState().queue[0].id).toBe('d2');

        useDonationStore.getState().dismissActive();

        expect(useDonationStore.getState().activeDonation?.id).toBe('d2');
        expect(useDonationStore.getState().queue).toHaveLength(0);

        useDonationStore.getState().dismissActive();
        expect(useDonationStore.getState().activeDonation).toBeNull();
    });

    it('updates settings and persists to state', () => {
        useDonationStore.getState().updateSettings({ duration: 8, position: 'bottom' });
        expect(useDonationStore.getState().settings.duration).toBe(8);
        expect(useDonationStore.getState().settings.position).toBe('bottom');
    });
});

