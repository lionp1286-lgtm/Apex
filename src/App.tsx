/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Menu,
  Plus,
  LayoutDashboard,
  Award,
  User,
  UtensilsCrossed,
  Trophy,
  Briefcase,
  ChefHat,
  Globe,
  Clock,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  ActiveTab,
  ApexPersistedState,
  CookedItemId,
  LanguageCode,
  MoodConfig,
  PrivacyPreferences,
  TaskItem,
  TaskTheme,
} from './types/apex';
import { applyMoodToDocument } from './data/moods';
import { INITIAL_PROGRESS, STADIUM_TIERS, THEME_META } from './data/rewards';
import { LANGUAGES, t, type TranslationKey } from './data/i18n';
import { playTone } from './utils/sound';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';
import { CookUnlockModal } from './components/CookUnlockModal';
import { SettingsDrawer, type SettingsModalType } from './components/SettingsDrawer';
import { SettingsModals } from './components/SettingsModals';
import { RewardsView } from './components/RewardsView';
import { ProfileView } from './components/ProfileView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

const STORAGE_KEY = 'apex_pwa_state_v1';

const DEFAULT_STATE: ApexPersistedState = {
  tasks: [],
  progress: INITIAL_PROGRESS,
  account: {
    isLoggedIn: false,
    name: '',
    email: '',
    selectedCharacter: 'cooking',
  },
  moodConfig: {
    mood: 'default',
    customAccent: '#2563EB',
    customBg: '#F8FAFC',
  },
  language: 'en',
  privacy: {
    soundEnabled: true,
    localBackupReminder: false,
  },
  rating: null,
};

function loadInitialState(): ApexPersistedState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ApexPersistedState>;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      progress: {
        ...INITIAL_PROGRESS,
        ...(parsed.progress || {}),
        cookedItems: {
          ...INITIAL_PROGRESS.cookedItems,
          ...(parsed.progress?.cookedItems || {}),
        },
      },
      account: {
        ...DEFAULT_STATE.account,
        ...(parsed.account || {}),
      },
      moodConfig: {
        ...DEFAULT_STATE.moodConfig,
        ...(parsed.moodConfig || {}),
      },
      language: parsed.language || 'en',
      privacy: {
        ...DEFAULT_STATE.privacy,
        ...(parsed.privacy || {}),
      },
      rating: parsed.rating || null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

type TaskFilter = 'all' | 'active' | 'completed' | 'failed';

interface ToastBanner {
  id: string;
  text: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export default function App() {
  const [state, setState] = useState<ApexPersistedState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCookOpen, setIsCookOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<SettingsModalType>(null);
  const [toasts, setToasts] = useState<ToastBanner[]>([]);

  const soundEnabledRef = useRef(state.privacy.soundEnabled);
  soundEnabledRef.current = state.privacy.soundEnabled;

  const languageRef = useRef(state.language);
  languageRef.current = state.language;

  const pushToast = useCallback((text: string, tone: 'positive' | 'negative' | 'neutral' = 'neutral') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  // Persist state to localStorage automatically
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Apply dynamic mood CSS variables
  useEffect(() => {
    applyMoodToDocument(state.moodConfig);
  }, [state.moodConfig]);

  // Apply language direction (LTR / RTL)
  useEffect(() => {
    const langMeta = LANGUAGES.find((l) => l.code === state.language) || LANGUAGES[0];
    document.documentElement.dir = langMeta.dir;
    document.documentElement.lang = langMeta.code;
  }, [state.language]);

  // Countdown tick loop (also catches tasks that expired while page was refreshed/closed)
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let changed = false;
      const expiredEvents: Array<{ name: string; theme: TaskTheme }> = [];

      setState((prev) => {
        let nextProgress = { ...prev.progress };
        const nextTasks = prev.tasks.map((task) => {
          if (task.status !== 'active' || !task.targetEndTime) return task;
          const remaining = Math.max(0, Math.ceil((task.targetEndTime - now) / 1000));
          if (remaining === 0) {
            changed = true;
            expiredEvents.push({ name: task.name, theme: task.theme });
            nextProgress.failedTasksCount += 1;
            if (task.theme === 'cooking') {
              nextProgress.flour = Math.max(0, nextProgress.flour - 10);
            } else if (task.theme === 'ball') {
              nextProgress.balls = Math.max(0, nextProgress.balls - 10);
            } else {
              nextProgress.successPoints = Math.max(0, nextProgress.successPoints - 5);
            }
            return {
              ...task,
              remainingSeconds: 0,
              targetEndTime: null,
              status: 'failed' as const,
            };
          }
          if (remaining !== task.remainingSeconds) {
            changed = true;
            return { ...task, remainingSeconds: remaining };
          }
          return task;
        });

        if (!changed) return prev;
        return {
          ...prev,
          tasks: nextTasks,
          progress: nextProgress,
        };
      });

      if (expiredEvents.length > 0) {
        playTone('fail', soundEnabledRef.current);
        const lang = languageRef.current;
        expiredEvents.forEach((ev) => {
          const penalty = THEME_META[ev.theme].penaltyAmount;
          const unit =
            ev.theme === 'cooking'
              ? t(lang, 'flourPoints')
              : ev.theme === 'ball'
              ? t(lang, 'ballsUnit')
              : t(lang, 'successPointsUnit');
          pushToast(t(lang, 'toastTaskFailed', { name: ev.name, penalty, unit }), 'negative');
        });
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [pushToast]);

  const handleAddTask = (name: string, durationSeconds: number, theme: TaskTheme) => {
    const now = Date.now();
    const newTask: TaskItem = {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      theme,
      durationSeconds,
      remainingSeconds: durationSeconds,
      targetEndTime: now + durationSeconds * 1000,
      status: 'active',
      createdAt: now,
    };
    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const handleCompleteTask = (id: string) => {
    const target = state.tasks.find((item) => item.id === id);
    if (!target || (target.status !== 'active' && target.status !== 'paused')) return;

    const lang = state.language;
    let milestoneToast: string | null = null;
    let hitMilestone = false;

    setState((prev) => {
      const nextProgress = { ...prev.progress };
      nextProgress.completedTasksCount += 1;

      if (target.theme === 'cooking') {
        nextProgress.flour += 10;
        if (nextProgress.flour >= 50) {
          hitMilestone = true;
        }
      } else if (target.theme === 'ball') {
        nextProgress.balls += 10;
        while (nextProgress.balls >= 50) {
          nextProgress.balls -= 50;
          nextProgress.playerLevel += 1;
          nextProgress.stadiumTier = Math.min(STADIUM_TIERS.length - 1, nextProgress.stadiumTier + 1);
          hitMilestone = true;
          const stadiumName = t(
            lang,
            STADIUM_TIERS[nextProgress.stadiumTier].key as TranslationKey
          );
          milestoneToast = t(lang, 'toastStadiumUp', {
            level: nextProgress.playerLevel,
            stadium: stadiumName,
          });
        }
      } else {
        nextProgress.successPoints += 10;
        while (nextProgress.successPoints >= 50) {
          nextProgress.successPoints -= 50;
          nextProgress.successLevel += 10;
          hitMilestone = true;
          milestoneToast = t(lang, 'toastSuccessUp', {
            level: nextProgress.successLevel,
          });
        }
      }

      return {
        ...prev,
        tasks: prev.tasks.map((item) =>
          item.id === id
            ? { ...item, status: 'completed', targetEndTime: null, completedAt: Date.now() }
            : item
        ),
        progress: nextProgress,
      };
    });

    const unit =
      target.theme === 'cooking'
        ? t(lang, 'flourPoints')
        : target.theme === 'ball'
        ? t(lang, 'ballsUnit')
        : t(lang, 'successPointsUnit');

    playTone(hitMilestone ? 'milestone' : 'complete', state.privacy.soundEnabled);
    pushToast(t(lang, 'toastTaskCompleted', { name: target.name, unit }), 'positive');
    if (milestoneToast) {
      pushToast(milestoneToast, 'positive');
    }
  };

  const handleTogglePause = (id: string) => {
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id !== id) return task;
        if (task.status === 'active') {
          const remaining = task.targetEndTime
            ? Math.max(1, Math.ceil((task.targetEndTime - now) / 1000))
            : task.remainingSeconds;
          return {
            ...task,
            status: 'paused',
            remainingSeconds: remaining,
            targetEndTime: null,
          };
        }
        if (task.status === 'paused') {
          return {
            ...task,
            status: 'active',
            targetEndTime: now + task.remainingSeconds * 1000,
          };
        }
        return task;
      }),
    }));
  };

  const handleDeleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  };

  const handleClearFinished = () => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.status === 'active' || task.status === 'paused'),
    }));
  };

  const handleCookItem = (itemId: CookedItemId) => {
    if (state.progress.flour < 50) return;
    setState((prev) => {
      if (prev.progress.flour < 50) return prev;
      return {
        ...prev,
        progress: {
          ...prev.progress,
          flour: prev.progress.flour - 50,
          totalCookedCount: prev.progress.totalCookedCount + 1,
          cookedItems: {
            ...prev.progress.cookedItems,
            [itemId]: (prev.progress.cookedItems[itemId] || 0) + 1,
          },
        },
      };
    });
    playTone('milestone', state.privacy.soundEnabled);
    pushToast(t(state.language, 'toastCookedDish', { dish: t(state.language, itemId) }), 'positive');
    setIsCookOpen(false);
  };

  const filteredTasks = useMemo(() => {
    return state.tasks.filter((task) => {
      if (taskFilter === 'all') return true;
      if (taskFilter === 'active') return task.status === 'active' || task.status === 'paused';
      return task.status === taskFilter;
    });
  }, [state.tasks, taskFilter]);

  const activeCount = useMemo(
    () => state.tasks.filter((item) => item.status === 'active' || item.status === 'paused').length,
    [state.tasks]
  );

  const finishedCount = state.tasks.length - activeCount;

  const displayName =
    state.account.isLoggedIn && state.account.name.trim()
      ? state.account.name.trim()
      : t(state.language, 'defaultUser');

  const currentStadium =
    STADIUM_TIERS[Math.min(state.progress.stadiumTier, STADIUM_TIERS.length - 1)];

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetAll = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-8">
      {/* Top Navigation Bar */}
      <header
        className="sticky top-0 z-30 h-14 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--app-header-bg)',
          borderBottom: '1px solid var(--app-border)',
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Zone 1: Hamburger + Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label={t(state.language, 'settingsTitle')}
              className="inline-flex items-center justify-center rounded-xl min-w-[44px] min-h-[44px] transition-colors"
              style={{
                backgroundColor: 'var(--app-surface-muted)',
                color: 'var(--app-text)',
              }}
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-xl font-bold tracking-tight whitespace-nowrap shrink-0 font-display"
              style={{ color: 'var(--app-text)' }}
            >
              {t(state.language, 'appName')}
            </button>
          </div>

          {/* Zone 2: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {(
              [
                { id: 'dashboard' as ActiveTab, label: t(state.language, 'navDashboard') },
                { id: 'rewards' as ActiveTab, label: t(state.language, 'navRewards') },
                { id: 'profile' as ActiveTab, label: t(state.language, 'navProfile') },
              ]
            ).map((navItem) => {
              const active = activeTab === navItem.id;
              return (
                <button
                  key={navItem.id}
                  type="button"
                  onClick={() => setActiveTab(navItem.id)}
                  className="py-1.5 whitespace-nowrap shrink-0 transition-opacity hover:opacity-100 relative"
                  style={{
                    color: active ? 'var(--app-text)' : 'var(--app-text-muted)',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {navItem.label}
                  {active && (
                    <span
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--app-accent)' }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher + Install + Primary CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center">
              <label htmlFor="top-lang-select" className="sr-only">
                {t(state.language, 'languageLabel')}
              </label>
              <div
                className="inline-flex items-center gap-1.5 rounded-xl px-2.5 h-10 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--app-surface-muted)',
                  color: 'var(--app-text)',
                  border: '1px solid var(--app-border)',
                }}
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <select
                  id="top-lang-select"
                  value={state.language}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      language: e.target.value as LanguageCode,
                    }))
                  }
                  className="bg-transparent outline-none cursor-pointer text-xs font-semibold"
                  style={{ color: 'var(--app-text)' }}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} style={{ color: '#0F172A', backgroundColor: '#FFFFFF' }}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden lg:block">
              <PWAInstallButton language={state.language} compact />
            </div>

            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 min-h-[40px]"
              style={{
                backgroundColor: 'var(--app-accent)',
                color: 'var(--app-accent-fg)',
              }}
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>{t(state.language, 'addNewTask')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Hero Row */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {t(state.language, 'hiUser', { name: displayName })}
                </h1>
                <p className="mt-1.5 text-sm sm:text-base max-w-2xl" style={{ color: 'var(--app-text-muted)' }}>
                  {t(state.language, 'dashboardSubtitle')}
                </p>
              </div>

              {state.progress.flour >= 50 && (
                <button
                  type="button"
                  onClick={() => setIsCookOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 min-h-[48px]"
                  style={{
                    backgroundColor: THEME_META.cooking.color,
                    color: '#FFFFFF',
                  }}
                >
                  <ChefHat className="w-5 h-5 shrink-0" />
                  <span>{t(state.language, 'cookNowBtn')}</span>
                </button>
              )}
            </section>

            {/* Rewards Progress Strip (3 Themes) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Theme 1: Cooking */}
              <div
                className="rounded-2xl p-5 flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--app-surface)',
                  border: '1px solid var(--app-border)',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: THEME_META.cooking.color }}
                    >
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t(state.language, 'themeCooking')}</div>
                      <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                        {t(state.language, 'cookedItemsLabel')}: {state.progress.totalCookedCount}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="font-mono-tabular text-xl font-bold">{state.progress.flour}</div>
                    <div className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                      / 50 {t(state.language, 'flourPoints')}
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (state.progress.flour / 50) * 100)}%`,
                      backgroundColor: THEME_META.cooking.color,
                    }}
                  />
                </div>
              </div>

              {/* Theme 2: Ball */}
              <div
                className="rounded-2xl p-5 flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--app-surface)',
                  border: '1px solid var(--app-border)',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: THEME_META.ball.color }}
                    >
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">
                        {t(state.language, 'playerLevelLabel')} {state.progress.playerLevel}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--app-text-muted)' }}>
                        {t(state.language, currentStadium.key as TranslationKey)}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="font-mono-tabular text-xl font-bold">{state.progress.balls}</div>
                    <div className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                      / 50 {t(state.language, 'ballsUnit')}
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (state.progress.balls / 50) * 100)}%`,
                      backgroundColor: THEME_META.ball.color,
                    }}
                  />
                </div>
              </div>

              {/* Theme 3: Successful Person */}
              <div
                className="rounded-2xl p-5 flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--app-surface)',
                  border: '1px solid var(--app-border)',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: THEME_META.success.color }}
                    >
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">
                        {t(state.language, 'successLevelLabel')} {state.progress.successLevel}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                        +10 / 50 {t(state.language, 'successPointsUnit')}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="font-mono-tabular text-xl font-bold">
                      {state.progress.successPoints}
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                      / 50 {t(state.language, 'successPointsUnit')}
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-surface-muted)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (state.progress.successPoints / 50) * 100)}%`,
                      backgroundColor: THEME_META.success.color,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Task Queue Header & Filter Controls */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{t(state.language, 'activeTasksTitle')}</h2>
                  <span className="text-xs font-mono-tabular" style={{ color: 'var(--app-text-muted)' }}>
                    {activeCount}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1 p-1 rounded-xl"
                    style={{
                      backgroundColor: 'var(--app-surface)',
                      border: '1px solid var(--app-border)',
                    }}
                  >
                    {(
                      [
                        { id: 'all' as TaskFilter, label: t(state.language, 'filterAll') },
                        { id: 'active' as TaskFilter, label: t(state.language, 'filterActive') },
                        { id: 'completed' as TaskFilter, label: t(state.language, 'filterCompleted') },
                        { id: 'failed' as TaskFilter, label: t(state.language, 'filterFailed') },
                      ]
                    ).map((tab) => {
                      const selected = taskFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setTaskFilter(tab.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
                          style={{
                            backgroundColor: selected ? 'var(--app-accent)' : 'transparent',
                            color: selected ? 'var(--app-accent-fg)' : 'var(--app-text-muted)',
                          }}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {finishedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearFinished}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 min-h-[38px]"
                      style={{
                        backgroundColor: 'var(--app-surface)',
                        color: 'var(--app-text-muted)',
                        border: '1px solid var(--app-border)',
                      }}
                    >
                      {t(state.language, 'clearFinished')}
                    </button>
                  )}
                </div>
              </div>

              {/* Tasks Grid or Empty State */}
              {filteredTasks.length === 0 ? (
                <div
                  className="rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: 'var(--app-surface)',
                    border: '1px solid var(--app-border)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--app-surface-muted)' }}
                  >
                    <Clock className="w-7 h-7" style={{ color: 'var(--app-text-muted)' }} />
                  </div>
                  <h3 className="text-lg font-bold">{t(state.language, 'emptyTasksTitle')}</h3>
                  <p className="mt-1.5 text-sm max-w-md" style={{ color: 'var(--app-text-muted)' }}>
                    {t(state.language, 'emptyTasksDesc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold min-h-[46px]"
                    style={{
                      backgroundColor: 'var(--app-accent)',
                      color: 'var(--app-accent-fg)',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t(state.language, 'createFirstTask')}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        language={state.language}
                        onComplete={handleCompleteTask}
                        onTogglePause={handleTogglePause}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'rewards' && (
          <RewardsView
            language={state.language}
            progress={state.progress}
            onOpenCookModal={() => setIsCookOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            language={state.language}
            account={state.account}
            progress={state.progress}
            onSelectCharacter={(theme) =>
              setState((prev) => ({
                ...prev,
                account: { ...prev.account, selectedCharacter: theme },
              }))
            }
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Compact 56px height to respect 15% mobile sticky cap) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 h-14 backdrop-blur-md grid grid-cols-4 items-center"
        style={{
          backgroundColor: 'var(--app-header-bg)',
          borderTop: '1px solid var(--app-border)',
        }}
      >
        {(
          [
            {
              id: 'dashboard',
              label: t(state.language, 'navDashboard'),
              icon: <LayoutDashboard className="w-5 h-5" />,
              active: activeTab === 'dashboard',
              onClick: () => setActiveTab('dashboard'),
            },
            {
              id: 'rewards',
              label: t(state.language, 'navRewards'),
              icon: <Award className="w-5 h-5" />,
              active: activeTab === 'rewards',
              onClick: () => setActiveTab('rewards'),
            },
            {
              id: 'profile',
              label: t(state.language, 'navProfile'),
              icon: <User className="w-5 h-5" />,
              active: activeTab === 'profile',
              onClick: () => setActiveTab('profile'),
            },
            {
              id: 'menu',
              label: t(state.language, 'navMenu'),
              icon: <Menu className="w-5 h-5" />,
              active: isDrawerOpen,
              onClick: () => setIsDrawerOpen(true),
            },
          ]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={tab.onClick}
            className="flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors"
            style={{
              color: tab.active ? 'var(--app-accent)' : 'var(--app-text-muted)',
            }}
          >
            {tab.icon}
            <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Toast Notifications */}
      <div className="fixed bottom-16 md:bottom-5 end-4 z-40 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="pointer-events-auto rounded-2xl px-4 py-3 text-xs font-semibold shadow-lg"
              style={{
                backgroundColor:
                  toast.tone === 'positive'
                    ? '#065F46'
                    : toast.tone === 'negative'
                    ? '#991B1B'
                    : 'var(--app-accent)',
                color: '#FFFFFF',
              }}
            >
              {toast.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <OfflineIndicator language={state.language} />

      {/* Modals & Drawers */}
      <AddTaskModal
        isOpen={isAddOpen}
        language={state.language}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddTask}
      />

      <CookUnlockModal
        isOpen={isCookOpen}
        language={state.language}
        flour={state.progress.flour}
        cookedItems={state.progress.cookedItems}
        onClose={() => setIsCookOpen(false)}
        onCook={handleCookItem}
      />

      <SettingsDrawer
        isOpen={isDrawerOpen}
        language={state.language}
        account={state.account}
        moodConfig={state.moodConfig}
        onClose={() => setIsDrawerOpen(false)}
        onMoodChange={(moodConfig: MoodConfig) =>
          setState((prev) => ({ ...prev, moodConfig }))
        }
        onLanguageChange={(language: LanguageCode) =>
          setState((prev) => ({ ...prev, language }))
        }
        onLogout={() =>
          setState((prev) => ({
            ...prev,
            account: { ...prev.account, isLoggedIn: false, name: '', email: '' },
          }))
        }
        onOpenProfile={() => setActiveTab('profile')}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      <SettingsModals
        activeModal={activeModal}
        language={state.language}
        account={state.account}
        privacy={state.privacy}
        rating={state.rating}
        onClose={() => setActiveModal(null)}
        onLogin={(name, email) =>
          setState((prev) => ({
            ...prev,
            account: { ...prev.account, isLoggedIn: true, name, email },
          }))
        }
        onUpdatePrivacy={(privacy: PrivacyPreferences) =>
          setState((prev) => ({ ...prev, privacy }))
        }
        onExportData={handleExportData}
        onResetAll={handleResetAll}
        onSaveRating={(stars, comment) =>
          setState((prev) => ({
            ...prev,
            rating: { stars, comment, submittedAt: Date.now() },
          }))
        }
      />
    </div>
  );
}
