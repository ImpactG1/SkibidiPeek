import { describe, expect, it } from 'vitest';

import { BUILT_IN_THEMES, DEFAULT_GIF_SIZE, themeToCSS } from './theme';

const base = BUILT_IN_THEMES[0];

describe('themeToCSS gif size', () => {
    it('emits --theme-gif-size scaled against the reference font size', () => {
        const css = themeToCSS({ ...base, gif_size: 140 });

        expect(css['--theme-gif-size']).toBe('10.000em');
    });

    it('falls back to the default for themes saved before gif_size existed', () => {
        const legacy = { ...base, gif_size: undefined } as unknown as typeof base;

        expect(themeToCSS(legacy)['--theme-gif-size']).toBe(
            themeToCSS({ ...base, gif_size: DEFAULT_GIF_SIZE })['--theme-gif-size']
        );
    });

    it('falls back to the default when gif_size is zero', () => {
        const css = themeToCSS({ ...base, gif_size: 0 });

        expect(css['--theme-gif-size']).toBe('8.000em');
    });

    it('gives every built-in theme a gif size', () => {
        for (const theme of BUILT_IN_THEMES) {
            expect(theme.gif_size, theme.id).toBeGreaterThan(0);
        }
    });

    it('includes all required built-in themes including neon, retro-terminal, glass, and skibidi', () => {
        const ids = BUILT_IN_THEMES.map((t) => t.id);

        expect(ids).toContain('default');
        expect(ids).toContain('compact');
        expect(ids).toContain('bubble');
        expect(ids).toContain('neon');
        expect(ids).toContain('retro-terminal');
        expect(ids).toContain('glass');
        expect(ids).toContain('skibidi');
    });

    it('provides valid animation properties for built-in themes', () => {
        for (const theme of BUILT_IN_THEMES) {
            expect(theme.name.length).toBeGreaterThan(0);
            expect(typeof theme.animation).toBe('string');
            expect(typeof theme.exit_animation).toBe('string');
            expect(theme.max_messages).toBeGreaterThan(0);
        }
    });
});
