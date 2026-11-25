import type { CookedItemId, ProgressState, TaskTheme } from '../types/apex';

export const THEME_CHARACTER_IMAGES: Record<TaskTheme, string> = {
  cooking: '/src/assets/images/theme_cooking_chef_1795504876067.jpg',
  ball: '/src/assets/images/theme_ball_player_1795504876068.jpg',
  success: '/src/assets/images/theme_success_person_1795504876452.jpg',
};

export const THEME_META: Record<
  TaskTheme,
  {
    color: string;
    softBg: string;
    rewardAmount: number;
    penaltyAmount: number;
    milestone: number;
  }
> = {
  cooking: {
    color: '#D97706',
    softBg: 'rgba(217, 119, 6, 0.12)',
    rewardAmount: 10,
    penaltyAmount: 10,
    milestone: 50,
  },
  ball: {
    color: '#059669',
    softBg: 'rgba(5, 150, 105, 0.12)',
    rewardAmount: 10,
    penaltyAmount: 10,
    milestone: 50,
  },
  success: {
    color: '#2563EB',
    softBg: 'rgba(37, 99, 235, 0.12)',
    rewardAmount: 10,
    penaltyAmount: 5,
    milestone: 50,
  },
};

export const COOKABLE_ITEMS: Array<{
  id: CookedItemId;
  color: string;
  softBg: string;
}> = [
  { id: 'cake', color: '#DB2777', softBg: 'rgba(219, 39, 119, 0.12)' },
  { id: 'cookies', color: '#B45309', softBg: 'rgba(180, 83, 9, 0.12)' },
  { id: 'pizza', color: '#DC2626', softBg: 'rgba(220, 38, 38, 0.12)' },
  { id: 'burger', color: '#D97706', softBg: 'rgba(217, 119, 6, 0.12)' },
  { id: 'pancakes', color: '#CA8A04', softBg: 'rgba(202, 138, 4, 0.12)' },
];

export const STADIUM_TIERS = [
  { tier: 0, key: 'tier0', capacity: '500' },
  { tier: 1, key: 'tier1', capacity: '2,500' },
  { tier: 2, key: 'tier2', capacity: '12,000' },
  { tier: 3, key: 'tier3', capacity: '35,000' },
  { tier: 4, key: 'tier4', capacity: '65,000' },
  { tier: 5, key: 'tier5', capacity: '95,000' },
];

export interface TrophyDefinition {
  id: string;
  titleKey: string;
  descKey: string;
  isUnlocked: (progress: ProgressState) => boolean;
}

export const TROPHY_DEFINITIONS: TrophyDefinition[] = [
  {
    id: 'first_victory',
    titleKey: 'trophyFirstWin',
    descKey: 'trophyFirstWinDesc',
    isUnlocked: (p) => p.completedTasksCount >= 1,
  },
  {
    id: 'master_baker',
    titleKey: 'trophyBaker',
    descKey: 'trophyBakerDesc',
    isUnlocked: (p) => p.totalCookedCount >= 1,
  },
  {
    id: 'full_menu',
    titleKey: 'trophyFullMenu',
    descKey: 'trophyFullMenuDesc',
    isUnlocked: (p) =>
      COOKABLE_ITEMS.every((item) => (p.cookedItems[item.id] || 0) >= 1),
  },
  {
    id: 'stadium_architect',
    titleKey: 'trophyStadium',
    descKey: 'trophyStadiumDesc',
    isUnlocked: (p) => p.playerLevel >= 2,
  },
  {
    id: 'apex_executive',
    titleKey: 'trophyExecutive',
    descKey: 'trophyExecutiveDesc',
    isUnlocked: (p) => p.successLevel >= 10,
  },
  {
    id: 'clock_master',
    titleKey: 'trophyClockMaster',
    descKey: 'trophyClockMasterDesc',
    isUnlocked: (p) => p.completedTasksCount >= 10,
  },
];

export const INITIAL_PROGRESS: ProgressState = {
  flour: 0,
  cookedItems: {
    cake: 0,
    cookies: 0,
    pizza: 0,
    burger: 0,
    pancakes: 0,
  },
  totalCookedCount: 0,
  balls: 0,
  playerLevel: 1,
  stadiumTier: 0,
  successPoints: 0,
  successLevel: 0,
  completedTasksCount: 0,
  failedTasksCount: 0,
};
