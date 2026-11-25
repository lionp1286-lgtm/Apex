export type TaskTheme = 'cooking' | 'ball' | 'success';

export type TaskStatus = 'active' | 'paused' | 'completed' | 'failed';

export type CookedItemId = 'cake' | 'cookies' | 'pizza' | 'burger' | 'pancakes';

export type AppMood =
  | 'default'
  | 'picker'
  | 'rainbow'
  | 'love'
  | 'sky'
  | 'ocean'
  | 'candy'
  | 'lavender'
  | 'unicorn';

export type LanguageCode = 'en' | 'ar' | 'es' | 'fr' | 'de';

export type ActiveTab = 'dashboard' | 'rewards' | 'profile';

export interface TaskItem {
  id: string;
  name: string;
  theme: TaskTheme;
  durationSeconds: number;
  remainingSeconds: number;
  targetEndTime: number | null;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
}

export interface CookedEntry {
  id: CookedItemId;
  count: number;
  lastCookedAt: number;
}

export interface ProgressState {
  flour: number;
  cookedItems: Record<CookedItemId, number>;
  totalCookedCount: number;
  balls: number;
  playerLevel: number;
  stadiumTier: number;
  successPoints: number;
  successLevel: number;
  completedTasksCount: number;
  failedTasksCount: number;
}

export interface UserAccount {
  isLoggedIn: boolean;
  name: string;
  email: string;
  selectedCharacter: TaskTheme;
}

export interface MoodConfig {
  mood: AppMood;
  customAccent: string;
  customBg: string;
}

export interface PrivacyPreferences {
  soundEnabled: boolean;
  localBackupReminder: boolean;
}

export interface RatingRecord {
  stars: number;
  comment: string;
  submittedAt: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface ApexPersistedState {
  tasks: TaskItem[];
  progress: ProgressState;
  account: UserAccount;
  moodConfig: MoodConfig;
  language: LanguageCode;
  privacy: PrivacyPreferences;
  rating: RatingRecord | null;
}
