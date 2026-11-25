import React from 'react';
import { UtensilsCrossed, Trophy, Briefcase, ChefHat, CheckCircle2 } from 'lucide-react';
import type { LanguageCode, ProgressState } from '../types/apex';
import { COOKABLE_ITEMS, STADIUM_TIERS, THEME_META } from '../data/rewards';
import { t, type TranslationKey } from '../data/i18n';
import { DishIllustration } from './DishIllustration';

interface RewardsViewProps {
  language: LanguageCode;
  progress: ProgressState;
  onOpenCookModal: () => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  language,
  progress,
  onOpenCookModal,
}) => {
  const flourPct = Math.min(100, (progress.flour / 50) * 100);
  const ballsPct = Math.min(100, (progress.balls / 50) * 100);
  const successPct = Math.min(100, (progress.successPoints / 50) * 100);
  const currentStadium = STADIUM_TIERS[Math.min(progress.stadiumTier, STADIUM_TIERS.length - 1)];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t(language, 'rewardsOverviewTitle')}</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--app-text-muted)' }}>
          {t(language, 'dashboardSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Theme 1: Cooking */}
        <article
          className="rounded-2xl p-6 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: THEME_META.cooking.color }}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t(language, 'themeCooking')}</h3>
                  <div className="text-xs font-mono-tabular" style={{ color: 'var(--app-text-muted)' }}>
                    {progress.flour} / 50 {t(language, 'flourPoints')}
                  </div>
                </div>
              </div>
              <span className="font-mono-tabular text-2xl font-bold">{progress.flour}</span>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${flourPct}%`, backgroundColor: THEME_META.cooking.color }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
              {t(language, 'cookingPathDesc')}
            </p>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {COOKABLE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl p-2 flex flex-col items-center text-center"
                  style={{ backgroundColor: 'var(--app-surface-muted)' }}
                >
                  <DishIllustration id={item.id} className="w-8 h-8" />
                  <span className="mt-1 text-[11px] font-medium truncate w-full">
                    {t(language, item.id)}
                  </span>
                  <span className="text-[11px] font-mono-tabular font-bold" style={{ color: 'var(--app-text-muted)' }}>
                    {progress.cookedItems[item.id] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={progress.flour < 50}
            onClick={onOpenCookModal}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-45 min-h-[46px]"
            style={{
              backgroundColor: 'var(--app-accent)',
              color: 'var(--app-accent-fg)',
            }}
          >
            <ChefHat className="w-4 h-4" />
            <span>{t(language, 'cookNowBtn')}</span>
          </button>
        </article>

        {/* Theme 2: Ball */}
        <article
          className="rounded-2xl p-6 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: THEME_META.ball.color }}
                >
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t(language, 'themeBall')}</h3>
                  <div className="text-xs font-mono-tabular" style={{ color: 'var(--app-text-muted)' }}>
                    {progress.balls} / 50 {t(language, 'ballsUnit')}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                  {t(language, 'playerLevelLabel')}
                </div>
                <div className="font-mono-tabular text-2xl font-bold">Lv.{progress.playerLevel}</div>
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${ballsPct}%`, backgroundColor: THEME_META.ball.color }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
              {t(language, 'ballPathDesc')}
            </p>

            <div className="mt-4 space-y-2">
              {STADIUM_TIERS.map((tier) => {
                const unlocked = progress.stadiumTier >= tier.tier;
                const isCurrent = currentStadium.tier === tier.tier;
                return (
                  <div
                    key={tier.tier}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs"
                    style={{
                      backgroundColor: isCurrent ? 'var(--app-accent-soft)' : 'var(--app-surface-muted)',
                      border: isCurrent ? `1px solid ${THEME_META.ball.color}` : '1px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0"
                        style={{ color: unlocked ? THEME_META.ball.color : 'var(--app-text-muted)', opacity: unlocked ? 1 : 0.35 }}
                      />
                      <span>{t(language, tier.key as TranslationKey)}</span>
                    </div>
                    <span className="font-mono-tabular" style={{ color: 'var(--app-text-muted)' }}>
                      {tier.capacity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        {/* Theme 3: Successful Person */}
        <article
          className="rounded-2xl p-6 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: THEME_META.success.color }}
                >
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t(language, 'themeSuccess')}</h3>
                  <div className="text-xs font-mono-tabular" style={{ color: 'var(--app-text-muted)' }}>
                    {progress.successPoints} / 50 {t(language, 'successPointsUnit')}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                  {t(language, 'successLevelLabel')}
                </div>
                <div className="font-mono-tabular text-2xl font-bold">Lv.{progress.successLevel}</div>
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${successPct}%`, backgroundColor: THEME_META.success.color }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
              {t(language, 'successPathDesc')}
            </p>

            <div className="mt-4 space-y-2.5">
              {[10, 20, 30, 40, 50].map((lvl) => {
                const reached = progress.successLevel >= lvl;
                return (
                  <div
                    key={lvl}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs"
                    style={{ backgroundColor: 'var(--app-surface-muted)' }}
                  >
                    <span className="font-semibold">
                      {t(language, 'successLevelLabel')} {lvl}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: reached ? THEME_META.success.color : 'var(--app-text-muted)' }}
                    >
                      {reached ? t(language, 'unlocked') : t(language, 'locked')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
