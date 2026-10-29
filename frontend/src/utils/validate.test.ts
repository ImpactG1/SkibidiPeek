import { describe, expect, it } from 'vitest';

import { validateYouTubeInput } from './validate';

describe('validateYouTubeInput', () => {
    it('returns null for empty input (optional)', () => {
        expect(validateYouTubeInput('')).toBeNull();
        expect(validateYouTubeInput('   ')).toBeNull();
    });

    it('accepts bare 11-character video IDs', () => {
        expect(validateYouTubeInput('0sfDth4lMLc')).toBeNull();
        expect(validateYouTubeInput('dQw4w9WgXcQ')).toBeNull();
        expect(validateYouTubeInput('_a1b2-c3d4e')).toBeNull();
    });

    it('accepts YouTube channel handles', () => {
        expect(validateYouTubeInput('@MrBeast')).toBeNull();
        expect(validateYouTubeInput('@LofiGirl')).toBeNull();
    });

    it('accepts raw 24-char YouTube channel IDs (UC...)', () => {
        expect(validateYouTubeInput('UCX6OQ3DkcsbYNE6H8uQQuVA')).toBeNull();
    });

    it('accepts standard YouTube URLs', () => {
        expect(validateYouTubeInput('https://www.youtube.com/watch?v=0sfDth4lMLc')).toBeNull();
        expect(validateYouTubeInput('https://youtu.be/0sfDth4lMLc')).toBeNull();
        expect(validateYouTubeInput('https://www.youtube.com/live/0sfDth4lMLc')).toBeNull();
        expect(validateYouTubeInput('https://youtube.com/live_chat?v=0sfDth4lMLc')).toBeNull();
        expect(validateYouTubeInput('https://m.youtube.com/watch?v=0sfDth4lMLc')).toBeNull();
        expect(validateYouTubeInput('https://music.youtube.com/watch?v=0sfDth4lMLc')).toBeNull();
        expect(validateYouTubeInput('youtube.com/live/0sfDth4lMLc')).toBeNull();
    });

    it('rejects invalid inputs', () => {
        expect(validateYouTubeInput('not-a-youtube-url')).toBe('validation.youtube_invalid_input');
        expect(validateYouTubeInput('https://twitch.tv/ninja')).toBe('validation.youtube_invalid_input');
        expect(validateYouTubeInput('https://vimeo.com/12345')).toBe('validation.youtube_invalid_input');
        expect(validateYouTubeInput('short')).toBe('validation.youtube_invalid_input');
    });
});
