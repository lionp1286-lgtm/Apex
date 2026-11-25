import React, { useState } from 'react';
import { X, UtensilsCrossed, Trophy, Briefcase, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { LanguageCode, TaskTheme } from '../types/apex';
import { t } from '../data/i18n';

interface AddTaskModalProps {
  isOpen: boolean;
  language: LanguageCode;
  onClose: () => void;
  onAdd: (name: string, durationSeconds: number, theme: TaskTheme) => void;
}

const PRESETS = [
  { label: '30s', minutes: 0, seconds: 30 },
  { label: '1m', minutes: 1, seconds: 0 },
  { label: '5m', minutes: 5, seconds: 0 },
  { label: '15m', minutes: 15, seconds: 0 },
  { label: '25m', minutes: 25, seconds: 0 },
  { label: '45m', minutes: 45, seconds: 0 },
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  language,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const [theme, setTheme] = useState<TaskTheme>('cooking');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    const totalSec = Math.max(5, minutes * 60 + seconds);
    if (!trimmed) return;
    onAdd(trimmed, totalSec, theme);
    setName('');
    setMinutes(15);
    setSeconds(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--app-surface)',
              color: 'var(--app-text)',
              border: '1px solid var(--app-border)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">{t(language, 'addNewTask')}</h2>
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

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="apex-task-name">
                  {t(language, 'taskNameLabel')}
                </label>
                <input
                  id="apex-task-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t(language, 'taskNamePlaceholder')}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow"
                  style={{
                    backgroundColor: 'var(--app-surface-muted)',
                    color: 'var(--app-text)',
                    border: '1px solid var(--app-border)',
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t(language, 'durationLabel')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="apex-task-mins"
                      className="block text-xs mb-1"
                      style={{ color: 'var(--app-text-muted)' }}
                    >
                      {t(language, 'minutes')}
                    </label>
                    <input
                      id="apex-task-mins"
                      type="number"
                      min={0}
                      max={240}
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, Math.min(240, Number(e.target.value) || 0)))}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm font-mono-tabular outline-none"
                      style={{
                        backgroundColor: 'var(--app-surface-muted)',
                        color: 'var(--app-text)',
                        border: '1px solid var(--app-border)',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apex-task-secs"
                      className="block text-xs mb-1"
                      style={{ color: 'var(--app-text-muted)' }}
                    >
                      {t(language, 'seconds')}
                    </label>
                    <input
                      id="apex-task-secs"
                      type="number"
                      min={0}
                      max={59}
                      value={seconds}
                      onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm font-mono-tabular outline-none"
                      style={{
                        backgroundColor: 'var(--app-surface-muted)',
                        color: 'var(--app-text)',
                        border: '1px solid var(--app-border)',
                      }}
                    />
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-2">
                  {PRESETS.map((preset) => {
                    const active = minutes === preset.minutes && seconds === preset.seconds;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setMinutes(preset.minutes);
                          setSeconds(preset.seconds);
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-mono-tabular font-semibold transition-colors min-h-[36px]"
                        style={{
                          backgroundColor: active ? 'var(--app-accent)' : 'var(--app-surface-muted)',
                          color: active ? 'var(--app-accent-fg)' : 'var(--app-text)',
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold mb-2">
                  {t(language, 'themeSelectionLabel')}
                </span>
                <div className="space-y-2.5">
                  {(
                    [
                      {
                        id: 'cooking' as TaskTheme,
                        title: t(language, 'themeCooking'),
                        rule: t(language, 'cookingRuleShort'),
                        icon: <UtensilsCrossed className="w-5 h-5" />,
                        accent: '#D97706',
                      },
                      {
                        id: 'ball' as TaskTheme,
                        title: t(language, 'themeBall'),
                        rule: t(language, 'ballRuleShort'),
                        icon: <Trophy className="w-5 h-5" />,
                        accent: '#059669',
                      },
                      {
                        id: 'success' as TaskTheme,
                        title: t(language, 'themeSuccess'),
                        rule: t(language, 'successRuleShort'),
                        icon: <Briefcase className="w-5 h-5" />,
                        accent: '#2563EB',
                      },
                    ]
                  ).map((item) => {
                    const selected = theme === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTheme(item.id)}
                        className="w-full flex items-center gap-3.5 rounded-2xl p-3.5 text-start transition-all min-h-[56px]"
                        style={{
                          backgroundColor: selected ? 'var(--app-accent-soft)' : 'var(--app-surface-muted)',
                          border: selected ? `2px solid ${item.accent}` : '1px solid var(--app-border)',
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                          style={{ backgroundColor: item.accent }}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">{item.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--app-text-muted)' }}>
                            {item.rule}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold min-h-[46px]"
                  style={{
                    backgroundColor: 'var(--app-surface-muted)',
                    color: 'var(--app-text)',
                  }}
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl py-3 text-sm font-semibold transition-transform active:scale-[0.98] min-h-[46px]"
                  style={{
                    backgroundColor: 'var(--app-accent)',
                    color: 'var(--app-accent-fg)',
                  }}
                >
                  {t(language, 'startCountdown')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
