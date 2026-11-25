import React, { useState } from 'react';
import { Award, CheckCircle2, Lock, UtensilsCrossed, Trophy, Briefcase } from 'lucide-react';
import type { LanguageCode, ProgressState, TaskTheme, UserAccount } from '../types/apex';
import {
  COOKABLE_ITEMS,
  STADIUM_TIERS,
  THEME_CHARACTER_IMAGES,
  TROPHY_DEFINITIONS,
} from '../data/rewards';
import { t, type TranslationKey } from '../data/i18n';
import { DishIllustration } from './DishIllustration';

interface ProfileViewProps {
  language: LanguageCode;
  account: UserAccount;
  progress: ProgressState;
  onSelectCharacter: (theme: TaskTheme) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  language,
  account,
  progress,
  onSelectCharacter,
}) => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const displayName = account.isLoggedIn && account.name.trim() ? account.name : t(language, 'defaultUser');
  const currentStadium = STADIUM_TIERS[Math.min(progress.stadiumTier, STADIUM_TIERS.length - 1)];

  const characterChoices: Array<{ id: TaskTheme; label: string; fallbackIcon: React.ReactNode }> = [
    { id: 'cooking', label: t(language, 'themeCooking'), fallbackIcon: <UtensilsCrossed className="w-8 h-8" /> },
    { id: 'ball', label: t(language, 'themeBall'), fallbackIcon: <Trophy className="w-8 h-8" /> },
    { id: 'success', label: t(language, 'themeSuccess'), fallbackIcon: <Briefcase className="w-8 h-8" /> },
  ];

  const activeChar = characterChoices.find((c) => c.id === account.selectedCharacter) || characterChoices[0];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t(language, 'profileTitle')}</h2>
      </div>

      {/* Character & Level Overview */}
      <div
        className="rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
        }}
      >
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <div
            className="w-36 h-36 rounded-3xl overflow-hidden flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: 'var(--app-surface-muted)',
              border: '1px solid var(--app-border)',
            }}
          >
            {!imgErrors[activeChar.id] ? (
              <img
                src={THEME_CHARACTER_IMAGES[activeChar.id]}
                alt={activeChar.label}
                referrerPolicy="no-referrer"
                onError={() => setImgErrors((prev) => ({ ...prev, [activeChar.id]: true }))}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2" style={{ color: 'var(--app-accent)' }}>
                {activeChar.fallbackIcon}
                <span className="text-xs font-semibold">{activeChar.label}</span>
              </div>
            )}
          </div>
          <h3 className="mt-3 text-xl font-bold">{displayName}</h3>
          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            {account.isLoggedIn ? account.email : t(language, 'guestMode')}
          </p>
        </div>

        <div className="md:col-span-8 space-y-5">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--app-text-muted)' }}>
              {t(language, 'selectCharacter')}
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {characterChoices.map((choice) => {
                const selected = account.selectedCharacter === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => onSelectCharacter(choice.id)}
                    className="rounded-xl p-2.5 flex items-center gap-2.5 text-start transition-all min-h-[48px]"
                    style={{
                      backgroundColor: selected ? 'var(--app-accent-soft)' : 'var(--app-surface-muted)',
                      border: selected ? '2px solid var(--app-accent)' : '1px solid var(--app-border)',
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-black/5">
                      {!imgErrors[choice.id] ? (
                        <img
                          src={THEME_CHARACTER_IMAGES[choice.id]}
                          alt={choice.label}
                          referrerPolicy="no-referrer"
                          onError={() => setImgErrors((prev) => ({ ...prev, [choice.id]: true }))}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        choice.fallbackIcon
                      )}
                    </div>
                    <span className="text-xs font-semibold truncate">{choice.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
              <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                {t(language, 'playerLevelLabel')}
              </div>
              <div className="mt-1 font-mono-tabular text-xl font-bold">Lv.{progress.playerLevel}</div>
            </div>
            <div className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
              <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                {t(language, 'successLevelLabel')}
              </div>
              <div className="mt-1 font-mono-tabular text-xl font-bold">Lv.{progress.successLevel}</div>
            </div>
            <div className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
              <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                {t(language, 'cookedItemsLabel')}
              </div>
              <div className="mt-1 font-mono-tabular text-xl font-bold">{progress.totalCookedCount}</div>
            </div>
            <div className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
              <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                {t(language, 'stadiumLabel')}
              </div>
              <div className="mt-1 text-xs font-bold truncate">
                {t(language, currentStadium.key as TranslationKey)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cooked Items Collection */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
        }}
      >
        <h3 className="text-lg font-bold">{t(language, 'cookedItemsLabel')}</h3>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {COOKABLE_ITEMS.map((item) => {
            const count = progress.cookedItems[item.id] || 0;
            return (
              <div
                key={item.id}
                className="rounded-2xl p-4 flex flex-col items-center text-center"
                style={{
                  backgroundColor: 'var(--app-surface-muted)',
                  opacity: count > 0 ? 1 : 0.65,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: item.softBg }}
                >
                  <DishIllustration id={item.id} className="w-10 h-10" />
                </div>
                <div className="mt-2.5 text-sm font-bold">{t(language, item.id)}</div>
                <div className="mt-0.5 font-mono-tabular text-xs" style={{ color: 'var(--app-text-muted)' }}>
                  ×{count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earned Trophies */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
        }}
      >
        <h3 className="text-lg font-bold">{t(language, 'earnedTrophies')}</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TROPHY_DEFINITIONS.map((trophy) => {
            const unlocked = trophy.isUnlocked(progress);
            return (
              <div
                key={trophy.id}
                className="rounded-2xl p-4 flex items-start gap-3.5"
                style={{
                  backgroundColor: unlocked ? 'var(--app-accent-soft)' : 'var(--app-surface-muted)',
                  border: unlocked ? '1px solid var(--app-accent)' : '1px solid var(--app-border)',
                  opacity: unlocked ? 1 : 0.72,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: unlocked ? 'var(--app-accent)' : 'var(--app-surface)',
                    color: unlocked ? 'var(--app-accent-fg)' : 'var(--app-text-muted)',
                  }}
                >
                  {unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold truncate">
                      {t(language, trophy.titleKey as TranslationKey)}
                    </span>
                    {unlocked && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
                    {t(language, trophy.descKey as TranslationKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
