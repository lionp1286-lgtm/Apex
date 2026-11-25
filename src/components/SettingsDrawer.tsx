import React from 'react';
import {
  X,
  User,
  LogIn,
  LogOut,
  Shield,
  HelpCircle,
  Star,
  Mail,
  Palette,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppMood, LanguageCode, MoodConfig, UserAccount } from '../types/apex';
import { PRESET_MOODS } from '../data/moods';
import { LANGUAGES, t, type TranslationKey } from '../data/i18n';
import { PWAInstallButton } from './PWAInstallButton';

export type SettingsModalType = 'auth' | 'privacy' | 'help' | 'rating' | 'contact' | null;

interface SettingsDrawerProps {
  isOpen: boolean;
  language: LanguageCode;
  account: UserAccount;
  moodConfig: MoodConfig;
  onClose: () => void;
  onMoodChange: (config: MoodConfig) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenModal: (modal: SettingsModalType) => void;
}

const MOOD_LIST: Array<{ id: AppMood; labelKey: TranslationKey }> = [
  { id: 'default', labelKey: 'moodDefault' },
  { id: 'picker', labelKey: 'moodPicker' },
  { id: 'rainbow', labelKey: 'moodRainbow' },
  { id: 'love', labelKey: 'moodLove' },
  { id: 'sky', labelKey: 'moodSky' },
  { id: 'ocean', labelKey: 'moodOcean' },
  { id: 'candy', labelKey: 'moodCandy' },
  { id: 'lavender', labelKey: 'moodLavender' },
  { id: 'unicorn', labelKey: 'moodUnicorn' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  language,
  account,
  moodConfig,
  onClose,
  onMoodChange,
  onLanguageChange,
  onLogout,
  onOpenProfile,
  onOpenModal,
}) => {
  const isRtl = language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: isRtl ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '100%' : '-100%' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm h-full overflow-y-auto p-5 shadow-2xl flex flex-col gap-6"
            style={{
              backgroundColor: 'var(--app-surface)',
              color: 'var(--app-text)',
              borderInlineEnd: '1px solid var(--app-border)',
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{t(language, 'settingsTitle')}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t(language, 'close')}
                className="inline-flex items-center justify-center rounded-xl min-w-[44px] min-h-[44px]"
                style={{
                  backgroundColor: 'var(--app-surface-muted)',
                  color: 'var(--app-text)',
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Section */}
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{
                backgroundColor: 'var(--app-surface-muted)',
                border: '1px solid var(--app-border)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                    {account.isLoggedIn ? t(language, 'signedInAs') : t(language, 'guestMode')}
                  </div>
                  <div className="text-sm font-bold truncate">
                    {account.isLoggedIn ? account.name : t(language, 'defaultUser')}
                  </div>
                  {account.isLoggedIn && (
                    <div className="text-xs truncate" style={{ color: 'var(--app-text-muted)' }}>
                      {account.email}
                    </div>
                  )}
                </div>

                {account.isLoggedIn ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 min-h-[40px]"
                    style={{
                      backgroundColor: 'var(--app-surface)',
                      color: 'var(--app-text)',
                      border: '1px solid var(--app-border)',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t(language, 'logout')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenModal('auth');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 min-h-[40px]"
                    style={{
                      backgroundColor: 'var(--app-accent)',
                      color: 'var(--app-accent-fg)',
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t(language, 'createAccountLogin')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* App Themes / Moods */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold mb-3" style={{ color: 'var(--app-text-muted)' }}>
                <Palette className="w-4 h-4" />
                <span>{t(language, 'moodsSection')}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {MOOD_LIST.map((item) => {
                  const active = moodConfig.mood === item.id;
                  const swatch =
                    item.id === 'picker'
                      ? moodConfig.customAccent
                      : PRESET_MOODS[item.id].swatch;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        onMoodChange({
                          ...moodConfig,
                          mood: item.id,
                        })
                      }
                      className="rounded-xl p-2.5 flex flex-col items-center gap-1.5 text-center transition-all min-h-[68px]"
                      style={{
                        backgroundColor: active ? 'var(--app-accent-soft)' : 'var(--app-surface-muted)',
                        border: active ? '2px solid var(--app-accent)' : '1px solid var(--app-border)',
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shrink-0"
                        style={{ background: swatch }}
                      />
                      <span className="text-[11px] font-semibold leading-tight">
                        {t(language, item.labelKey)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {moodConfig.mood === 'picker' && (
                <div
                  className="mt-3 rounded-xl p-3 grid grid-cols-2 gap-3"
                  style={{
                    backgroundColor: 'var(--app-surface-muted)',
                    border: '1px solid var(--app-border)',
                  }}
                >
                  <label className="flex flex-col gap-1 text-xs font-medium">
                    <span>{t(language, 'accentColorLabel')}</span>
                    <input
                      type="color"
                      value={moodConfig.customAccent}
                      onChange={(e) =>
                        onMoodChange({ ...moodConfig, mood: 'picker', customAccent: e.target.value })
                      }
                      className="w-full h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-medium">
                    <span>{t(language, 'backgroundColorLabel')}</span>
                    <input
                      type="color"
                      value={moodConfig.customBg}
                      onChange={(e) =>
                        onMoodChange({ ...moodConfig, mood: 'picker', customBg: e.target.value })
                      }
                      className="w-full h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div>
              <label
                htmlFor="drawer-lang-select"
                className="flex items-center gap-2 text-xs font-semibold mb-2"
                style={{ color: 'var(--app-text-muted)' }}
              >
                <Globe className="w-4 h-4" />
                <span>{t(language, 'languageLabel')}</span>
              </label>
              <select
                id="drawer-lang-select"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none min-h-[44px]"
                style={{
                  backgroundColor: 'var(--app-surface-muted)',
                  color: 'var(--app-text)',
                  border: '1px solid var(--app-border)',
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1.5">
              {(
                [
                  {
                    label: t(language, 'viewProfile'),
                    icon: <User className="w-4 h-4" />,
                    onClick: () => {
                      onClose();
                      onOpenProfile();
                    },
                  },
                  {
                    label: t(language, 'privacyAccount'),
                    icon: <Shield className="w-4 h-4" />,
                    onClick: () => {
                      onClose();
                      onOpenModal('privacy');
                    },
                  },
                  {
                    label: t(language, 'helpCenter'),
                    icon: <HelpCircle className="w-4 h-4" />,
                    onClick: () => {
                      onClose();
                      onOpenModal('help');
                    },
                  },
                  {
                    label: t(language, 'yourRating'),
                    icon: <Star className="w-4 h-4" />,
                    onClick: () => {
                      onClose();
                      onOpenModal('rating');
                    },
                  },
                  {
                    label: t(language, 'contactUs'),
                    icon: <Mail className="w-4 h-4" />,
                    onClick: () => {
                      onClose();
                      onOpenModal('contact');
                    },
                  },
                ]
              ).map((row) => (
                <button
                  key={row.label}
                  type="button"
                  onClick={row.onClick}
                  className="w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors min-h-[46px]"
                  style={{
                    backgroundColor: 'var(--app-surface-muted)',
                    color: 'var(--app-text)',
                  }}
                >
                  <span className="flex items-center gap-3">
                    {row.icon}
                    <span>{row.label}</span>
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              ))}
            </nav>

            <div className="pt-2">
              <PWAInstallButton language={language} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
