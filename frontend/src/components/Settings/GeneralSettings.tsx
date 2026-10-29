import { useTranslation } from 'react-i18next';

import { Toggle } from '@/components/Toggle';
import { useConfigStore } from '@/stores/config';

import { HotkeyInput } from './HotkeyInput';

const languages = [
    { value: 'en-US', label: 'English' },
    { value: 'de-DE', label: 'Deutsch' },
];

export function GeneralSettings() {
    const { t, i18n } = useTranslation();
    const config = useConfigStore((s) => s.config);
    const update = useConfigStore((s) => s.update);

    const handleLanguageChange = (lang: string) => {
        void i18n.changeLanguage(lang);
        void update({ general: { language: lang } });
    };

    const lockKeybind = config?.keybinds?.lock?.keybind || config?.keybinds?.vanish?.keybind || 'Ctrl+Shift+L';
    const bgOpacity = Math.round((config?.general?.background_opacity ?? 1.0) * 100);
    const textOpacity = Math.round((config?.general?.text_opacity ?? 1.0) * 100);

    return (
        <>
            <div className="field">
                <label className="field-label">{t('settings.general.language')}</label>
                <select
                    value={config?.general?.language ?? 'en-US'}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                >
                    {languages.map((lang) => (
                        <option
                            key={lang.value}
                            value={lang.value}
                        >
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="field-row">
                <label className="field-label">{t('settings.general.show_timestamps')}</label>
                <Toggle
                    checked={config?.general?.show_timestamps ?? false}
                    onChange={(v) => void update({ general: { show_timestamps: v } })}
                />
            </div>

            <div className="field-row">
                <label className="field-label">{t('settings.general.show_waiting_message')}</label>
                <Toggle
                    checked={config?.general?.show_waiting_message ?? true}
                    onChange={(v) => void update({ general: { show_waiting_message: v } })}
                />
            </div>

            <div className="field-row">
                <label className="field-label">
                    {t('settings.general.reduce_motion', { defaultValue: 'Reduce animations' })}
                </label>
                <Toggle
                    checked={config?.general?.reduce_motion ?? false}
                    onChange={(v) => void update({ general: { reduce_motion: v } })}
                />
            </div>

            <div className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="field-label">
                        {t('settings.general.bg_opacity', { defaultValue: 'Background Opacity' })}
                    </label>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{bgOpacity}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={bgOpacity}
                    onChange={(e) => void update({ general: { background_opacity: Number(e.target.value) / 100 } })}
                />
            </div>

            <div className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="field-label">
                        {t('settings.general.text_opacity', { defaultValue: 'Text Opacity' })}
                    </label>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{textOpacity}%</span>
                </div>
                <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={textOpacity}
                    onChange={(e) => void update({ general: { text_opacity: Number(e.target.value) / 100 } })}
                />
            </div>

            <div className="field">
                <label className="field-label">
                    {t('settings.general.lock_hotkey', { defaultValue: 'Lock Hotkey (Click-Through Toggle)' })}
                </label>
                <HotkeyInput
                    value={lockKeybind}
                    onChange={(v) =>
                        void update({
                            keybinds: {
                                lock: { keybind: v },
                                vanish: { keybind: v },
                            },
                        })
                    }
                />
            </div>
        </>
    );
}
