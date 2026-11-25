import React from 'react';
import { Check, Pause, Play, Trash2, UtensilsCrossed, Trophy, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import type { LanguageCode, TaskItem, TaskTheme } from '../types/apex';
import { THEME_META } from '../data/rewards';
import { t } from '../data/i18n';

interface TaskCardProps {
  task: TaskItem;
  language: LanguageCode;
  onComplete: (id: string) => void;
  onTogglePause: (id: string) => void;
  onDelete: (id: string) => void;
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getThemeIcon(theme: TaskTheme) {
  switch (theme) {
    case 'cooking':
      return <UtensilsCrossed className="w-4 h-4 shrink-0" />;
    case 'ball':
      return <Trophy className="w-4 h-4 shrink-0" />;
    case 'success':
      return <Briefcase className="w-4 h-4 shrink-0" />;
  }
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  language,
  onComplete,
  onTogglePause,
  onDelete,
}) => {
  const themeMeta = THEME_META[task.theme];
  const progressRatio =
    task.durationSeconds > 0
      ? Math.max(0, Math.min(1, task.remainingSeconds / task.durationSeconds))
      : 0;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const isRunning = task.status === 'active';
  const isPaused = task.status === 'paused';
  const isCompleted = task.status === 'completed';
  const isFailed = task.status === 'failed';
  const isUrgent = isRunning && task.remainingSeconds <= 15;

  const themeLabel =
    task.theme === 'cooking'
      ? t(language, 'themeCooking')
      : task.theme === 'ball'
      ? t(language, 'themeBall')
      : t(language, 'themeSuccess');

  const statusLabel =
    task.status === 'active'
      ? t(language, 'statusActive')
      : task.status === 'paused'
      ? t(language, 'statusPaused')
      : task.status === 'completed'
      ? t(language, 'statusCompleted')
      : t(language, 'statusFailed');

  const ringColor = isCompleted
    ? '#16A34A'
    : isFailed || isUrgent
    ? '#DC2626'
    : themeMeta.color;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-4 sm:p-5 transition-colors"
      style={{
        backgroundColor: 'var(--app-surface)',
        border: '1px solid var(--app-border)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60" aria-hidden="true">
              <circle
                cx="30"
                cy="30"
                r={radius}
                fill="none"
                stroke="var(--app-surface-muted)"
                strokeWidth="4.5"
              />
              <circle
                cx="30"
                cy="30"
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={isCompleted ? 0 : strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.4s linear' }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ color: ringColor }}
            >
              {getThemeIcon(task.theme)}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate" style={{ color: 'var(--app-text)' }}>
              {task.name}
            </h3>
            <div
              className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs"
              style={{ color: 'var(--app-text-muted)' }}
            >
              <span>{themeLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{formatCountdown(task.durationSeconds)}</span>
              <span aria-hidden="true">·</span>
              <span
                className="font-medium"
                style={{
                  color: isCompleted
                    ? '#16A34A'
                    : isFailed
                    ? '#DC2626'
                    : isUrgent
                    ? '#D97706'
                    : 'var(--app-text)',
                }}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="text-end shrink-0">
          <div
            className="font-mono-tabular text-xl sm:text-2xl font-bold tracking-tight"
            style={{
              color: isFailed ? '#DC2626' : isCompleted ? '#16A34A' : isUrgent ? '#DC2626' : 'var(--app-text)',
            }}
          >
            {isCompleted ? '00:00' : formatCountdown(task.remainingSeconds)}
          </div>
        </div>
      </div>

      <div
        className="mt-4 pt-3 flex items-center justify-between gap-2"
        style={{ borderTop: '1px solid var(--app-border)' }}
      >
        <div className="flex items-center gap-2">
          {(isRunning || isPaused) && (
            <>
              <button
                type="button"
                onClick={() => onComplete(task.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 min-h-[40px] sm:min-h-[38px]"
                style={{
                  backgroundColor: 'var(--app-accent)',
                  color: 'var(--app-accent-fg)',
                }}
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>{t(language, 'complete')}</span>
              </button>

              <button
                type="button"
                onClick={() => onTogglePause(task.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] sm:min-h-[38px]"
                style={{
                  backgroundColor: 'var(--app-surface-muted)',
                  color: 'var(--app-text)',
                }}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 shrink-0" /> : <Pause className="w-3.5 h-3.5 shrink-0" />}
                <span>{isPaused ? t(language, 'resume') : t(language, 'pause')}</span>
              </button>
            </>
          )}

          {(isCompleted || isFailed) && (
            <span
              className="text-xs font-medium"
              style={{ color: isCompleted ? '#16A34A' : '#DC2626' }}
            >
              {isCompleted
                ? `+${themeMeta.rewardAmount} ${
                    task.theme === 'cooking'
                      ? t(language, 'flourPoints')
                      : task.theme === 'ball'
                      ? t(language, 'ballsUnit')
                      : t(language, 'successPointsUnit')
                  }`
                : `-${themeMeta.penaltyAmount} ${
                    task.theme === 'cooking'
                      ? t(language, 'flourPoints')
                      : task.theme === 'ball'
                      ? t(language, 'ballsUnit')
                      : t(language, 'successPointsUnit')
                  }`}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={t(language, 'delete')}
          className="inline-flex items-center justify-center rounded-xl p-2 transition-colors hover:opacity-80 min-w-[40px] min-h-[40px]"
          style={{ color: 'var(--app-text-muted)' }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
};
