export function stripWhitespace(value: string): string {
    return value.replace(/\s/g, '');
}

export function validateYouTubeInput(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return null;
    }

    if (/^@[a-zA-Z0-9_.-]+$/.test(trimmed)) {
        return null;
    }

    if (/^UC[a-zA-Z0-9_-]{22}$/.test(trimmed)) {
        return null;
    }

    try {
        const urlStr = trimmed.includes('://') ? trimmed : `https://${trimmed}`;
        const parsed = new URL(urlStr);
        const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

        const validHosts = ['youtube.com', 'm.youtube.com', 'music.youtube.com', 'gaming.youtube.com', 'youtu.be'];

        if (validHosts.includes(host)) {
            return null;
        }
    } catch {
        // Fall through to error
    }

    return 'validation.youtube_invalid_input';
}

export function validateTwitchChannel(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    if (trimmed.length < 3 || trimmed.length > 25) {
        return 'validation.twitch_channel_length';
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return 'validation.twitch_channel_chars';
    }

    return null;
}

export function validateKickChannel(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    if (trimmed.length < 3 || trimmed.length > 26) {
        return 'validation.kick_channel_length';
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return 'validation.kick_channel_chars';
    }

    return null;
}

export function validateFadeTimeout(value: number): string | null {
    if (!Number.isInteger(value) || value < 1 || value > 300) {
        return 'validation.fade_timeout';
    }

    return null;
}

export function validateThemeName(value: string): string | null {
    if (!value.trim()) {
        return 'validation.theme_name_empty';
    }

    return null;
}
