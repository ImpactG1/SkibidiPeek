export interface Theme {
    id: string;
    name: string;
    font_family: string;
    font_size: number;
    line_height: number;
    message_bg: string;
    message_padding: string;
    message_radius: number;
    message_gap: number;
    username_weight: number;
    show_colon: boolean;
    badge_size: number;
    emote_size: number;
    gif_size: number;
    show_avatars: boolean;
    avatar_size: number;
    text_weight: number;
    text_shadow: string;
    text_color: string;
    text_stroke_width: number;
    text_stroke_color: string;
    top_to_bottom: boolean;
    animation?: string;
    exit_animation?: string;
    max_messages?: number;
}

export const BUILT_IN_THEMES: Theme[] = [
    {
        id: 'default',
        name: 'Default',
        font_family: 'inherit',
        font_size: 16,
        line_height: 1.6,
        message_bg: 'transparent',
        message_padding: '2px 0',
        message_radius: 0,
        message_gap: 0,
        username_weight: 600,
        show_colon: true,
        badge_size: 18,
        emote_size: 28,
        gif_size: 112,
        show_avatars: true,
        avatar_size: 18,
        text_weight: 400,
        text_shadow: 'none',
        text_color: 'inherit',
        text_stroke_width: 0,
        text_stroke_color: '#000000',
        top_to_bottom: false,
        animation: 'none',
        exit_animation: 'fade',
        max_messages: 100,
    },
    {
        id: 'compact',
        name: 'Compact',
        font_family: 'inherit',
        font_size: 12,
        line_height: 1.3,
        message_bg: 'transparent',
        message_padding: '1px 0',
        message_radius: 0,
        message_gap: 0,
        username_weight: 600,
        show_colon: true,
        badge_size: 14,
        emote_size: 20,
        gif_size: 80,
        show_avatars: false,
        avatar_size: 0,
        text_weight: 400,
        text_shadow: 'none',
        text_color: 'inherit',
        text_stroke_width: 0,
        text_stroke_color: '#000000',
        top_to_bottom: false,
        animation: 'none',
        exit_animation: 'fade',
        max_messages: 100,
    },
    {
        id: 'bubble',
        name: 'Bubble',
        font_family: 'inherit',
        font_size: 16,
        line_height: 1.5,
        message_bg: 'rgba(0, 0, 0, 0.3)',
        message_padding: '4px 8px',
        message_radius: 6,
        message_gap: 4,
        username_weight: 700,
        show_colon: true,
        badge_size: 18,
        emote_size: 28,
        gif_size: 112,
        show_avatars: true,
        avatar_size: 20,
        text_weight: 400,
        text_shadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        text_color: '#ffffff',
        text_stroke_width: 0,
        text_stroke_color: '#000000',
        top_to_bottom: false,
        animation: 'pop',
        exit_animation: 'fade',
        max_messages: 100,
    },
    {
        id: 'neon',
        name: 'Neon',
        font_family: "'Segoe UI', system-ui, sans-serif",
        font_size: 15,
        line_height: 1.5,
        message_bg: 'rgba(15, 5, 29, 0.75)',
        message_padding: '5px 10px',
        message_radius: 8,
        message_gap: 5,
        username_weight: 700,
        show_colon: true,
        badge_size: 18,
        emote_size: 28,
        gif_size: 112,
        show_avatars: true,
        avatar_size: 20,
        text_weight: 500,
        text_shadow: '0 0 6px rgba(0, 255, 255, 0.8), 0 0 12px rgba(255, 0, 128, 0.4)',
        text_color: '#00ffff',
        text_stroke_width: 0,
        text_stroke_color: '#000000',
        top_to_bottom: false,
        animation: 'pop',
        exit_animation: 'fade',
        max_messages: 100,
    },
    {
        id: 'retro-terminal',
        name: 'Retro Terminal',
        font_family: "'Consolas', 'Courier New', monospace",
        font_size: 14,
        line_height: 1.4,
        message_bg: 'rgba(0, 20, 0, 0.85)',
        message_padding: '4px 8px',
        message_radius: 2,
        message_gap: 3,
        username_weight: 700,
        show_colon: true,
        badge_size: 16,
        emote_size: 24,
        gif_size: 96,
        show_avatars: false,
        avatar_size: 0,
        text_weight: 400,
        text_shadow: '0 0 5px rgba(51, 255, 51, 0.7)',
        text_color: '#33ff33',
        text_stroke_width: 0,
        text_stroke_color: '#000000',
        top_to_bottom: false,
        animation: 'typewriter',
        exit_animation: 'fade',
        max_messages: 100,
    },
    {
        id: 'glass',
        name: 'Glass',
        font_family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        font_size: 15,
        line_height: 1.5,
        message_bg: 'rgba(255, 255, 255, 0.12)',
        message_padding: '6px 12px',
        message_radius: 12,
        message_gap: 6,
        username_weight: 600,
        show_colon: true,
        badge_size: 18,
        emote_size: 28,
        gif_size: 112,
        show_avatars: true,
        avatar_size: 20,
        text_weight: 400,
        text_shadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
        text_color: '#ffffff',
        text_stroke_width: 0,
        text_stroke_color: '#000000',
        top_to_bottom: false,
        animation: 'slide',
        exit_animation: 'fade',
        max_messages: 100,
    },
    {
        id: 'skibidi',
        name: 'Meme / Skibidi',
        font_family: "'Impact', 'Arial Black', sans-serif",
        font_size: 16,
        line_height: 1.4,
        message_bg: 'rgba(255, 230, 0, 0.2)',
        message_padding: '6px 12px',
        message_radius: 16,
        message_gap: 6,
        username_weight: 800,
        show_colon: true,
        badge_size: 20,
        emote_size: 32,
        gif_size: 128,
        show_avatars: true,
        avatar_size: 22,
        text_weight: 700,
        text_shadow: '2px 2px 0px #ff0055, -2px -2px 0px #00e5ff',
        text_color: '#ffffff',
        text_stroke_width: 1,
        text_stroke_color: '#000000',
        top_to_bottom: false,
        animation: 'bounce',
        exit_animation: 'shrink',
        max_messages: 100,
    },
];

export function getThemeById(id: string, customThemes: Theme[] = []): Theme {
    return BUILT_IN_THEMES.find((t) => t.id === id) ?? customThemes.find((t) => t.id === id) ?? BUILT_IN_THEMES[0];
}

// Reference font size (14px = Default theme). Slider values for badge/emote/avatar
// are defined relative to this size and scale proportionally when font_size changes.
const REF_FONT_SIZE = 14;

export const DEFAULT_GIF_SIZE = 112;

export function themeToCSS(theme: Theme): Record<string, string> {
    return {
        '--theme-font-family': theme.font_family,
        '--theme-font-size': `${theme.font_size || 14}px`,
        '--theme-line-height': String(theme.line_height),
        '--theme-message-bg': theme.message_bg,
        '--theme-message-padding': theme.message_padding,
        '--theme-message-radius': `${theme.message_radius}px`,
        '--theme-message-gap': `${theme.message_gap}px`,
        '--theme-username-weight': String(theme.username_weight),
        '--theme-badge-size': `${(theme.badge_size / REF_FONT_SIZE).toFixed(3)}em`,
        '--theme-emote-size': `${(theme.emote_size / REF_FONT_SIZE).toFixed(3)}em`,
        '--theme-gif-size': `${((theme.gif_size || DEFAULT_GIF_SIZE) / REF_FONT_SIZE).toFixed(3)}em`,
        '--theme-avatar-size': `${(theme.avatar_size / REF_FONT_SIZE).toFixed(3)}em`,
        '--theme-text-weight': String(theme.text_weight),
        '--theme-text-shadow': theme.text_shadow,
        '--theme-text-color': theme.text_color,
        '--theme-text-stroke': theme.text_stroke_width
            ? `${theme.text_stroke_width}px ${theme.text_stroke_color}`
            : '0',
    };
}
