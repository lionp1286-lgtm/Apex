import type { AppMood, MoodConfig } from '../types/apex';

export interface MoodThemeTokens {
  id: AppMood;
  swatch: string;
  bg: string;
  bgPattern: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  accentFg: string;
  accentSoft: string;
  headerBg: string;
  themeColorMeta: string;
}

export const PRESET_MOODS: Record<Exclude<AppMood, 'picker'>, MoodThemeTokens> = {
  default: {
    id: 'default',
    swatch: '#0F172A',
    bg: '#F8FAFC',
    bgPattern: 'none',
    surface: '#FFFFFF',
    surfaceMuted: '#F1F5F9',
    text: '#0F172A',
    textMuted: '#475569',
    border: 'rgba(15, 23, 42, 0.09)',
    accent: '#0F172A',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(15, 23, 42, 0.07)',
    headerBg: 'rgba(255, 255, 255, 0.88)',
    themeColorMeta: '#0F172A',
  },
  rainbow: {
    id: 'rainbow',
    swatch: 'linear-gradient(135deg, #F43F5E, #F59E0B, #10B981, #3B82F6, #8B5CF6)',
    bg: '#FAF9FF',
    bgPattern:
      'radial-gradient(at 8% 12%, rgba(244, 63, 94, 0.11) 0px, transparent 42%), radial-gradient(at 88% 14%, rgba(59, 130, 246, 0.11) 0px, transparent 42%), radial-gradient(at 52% 88%, rgba(16, 185, 129, 0.10) 0px, transparent 48%), radial-gradient(at 15% 80%, rgba(245, 158, 11, 0.10) 0px, transparent 40%)',
    surface: '#FFFFFF',
    surfaceMuted: '#F3F4F6',
    text: '#111827',
    textMuted: '#4B5563',
    border: 'rgba(99, 102, 241, 0.15)',
    accent: '#4F46E5',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(79, 70, 229, 0.10)',
    headerBg: 'rgba(255, 255, 255, 0.86)',
    themeColorMeta: '#4F46E5',
  },
  love: {
    id: 'love',
    swatch: '#E11D48',
    bg: '#FFF5F7',
    bgPattern:
      'radial-gradient(at 14% 10%, rgba(244, 63, 94, 0.12) 0px, transparent 45%), radial-gradient(at 88% 85%, rgba(251, 113, 133, 0.12) 0px, transparent 45%)',
    surface: '#FFFFFF',
    surfaceMuted: '#FFE4E8',
    text: '#3F0D1D',
    textMuted: '#881337',
    border: 'rgba(225, 29, 72, 0.14)',
    accent: '#BE123C',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(190, 18, 60, 0.10)',
    headerBg: 'rgba(255, 245, 247, 0.88)',
    themeColorMeta: '#BE123C',
  },
  sky: {
    id: 'sky',
    swatch: '#0284C7',
    bg: '#F0F9FF',
    bgPattern:
      'radial-gradient(at 82% 10%, rgba(56, 189, 248, 0.16) 0px, transparent 45%), radial-gradient(at 14% 85%, rgba(14, 165, 233, 0.10) 0px, transparent 45%)',
    surface: '#FFFFFF',
    surfaceMuted: '#E0F2FE',
    text: '#0C2D48',
    textMuted: '#0369A1',
    border: 'rgba(2, 132, 199, 0.15)',
    accent: '#0369A1',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(3, 105, 161, 0.10)',
    headerBg: 'rgba(240, 249, 255, 0.88)',
    themeColorMeta: '#0369A1',
  },
  ocean: {
    id: 'ocean',
    swatch: '#0D9488',
    bg: '#F0FDFA',
    bgPattern:
      'radial-gradient(at 15% 15%, rgba(20, 184, 166, 0.15) 0px, transparent 45%), radial-gradient(at 88% 82%, rgba(6, 182, 212, 0.14) 0px, transparent 45%)',
    surface: '#FFFFFF',
    surfaceMuted: '#CCFBF1',
    text: '#0F2E2C',
    textMuted: '#115E59',
    border: 'rgba(13, 148, 136, 0.16)',
    accent: '#0F766E',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(15, 118, 110, 0.10)',
    headerBg: 'rgba(240, 253, 250, 0.88)',
    themeColorMeta: '#0F766E',
  },
  candy: {
    id: 'candy',
    swatch: '#DB2777',
    bg: '#FDF2F8',
    bgPattern:
      'radial-gradient(at 12% 15%, rgba(236, 72, 153, 0.12) 0px, transparent 42%), radial-gradient(at 86% 20%, rgba(45, 212, 191, 0.12) 0px, transparent 42%)',
    surface: '#FFFFFF',
    surfaceMuted: '#FCE7F3',
    text: '#3B0726',
    textMuted: '#831843',
    border: 'rgba(219, 39, 119, 0.14)',
    accent: '#BE185D',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(190, 24, 93, 0.10)',
    headerBg: 'rgba(253, 242, 248, 0.88)',
    themeColorMeta: '#BE185D',
  },
  lavender: {
    id: 'lavender',
    swatch: '#7C3AED',
    bg: '#F5F3FF',
    bgPattern:
      'radial-gradient(at 85% 12%, rgba(139, 92, 246, 0.14) 0px, transparent 45%), radial-gradient(at 15% 88%, rgba(167, 139, 250, 0.12) 0px, transparent 45%)',
    surface: '#FFFFFF',
    surfaceMuted: '#EDE9FE',
    text: '#221048',
    textMuted: '#5B21B6',
    border: 'rgba(124, 58, 237, 0.14)',
    accent: '#6D28D9',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(109, 40, 217, 0.10)',
    headerBg: 'rgba(245, 243, 255, 0.88)',
    themeColorMeta: '#6D28D9',
  },
  unicorn: {
    id: 'unicorn',
    swatch: 'linear-gradient(135deg, #EC4899, #A855F7, #38BDF8)',
    bg: '#FAF5FF',
    bgPattern:
      'radial-gradient(at 10% 10%, rgba(236, 72, 153, 0.12) 0px, transparent 42%), radial-gradient(at 85% 15%, rgba(56, 189, 248, 0.14) 0px, transparent 44%), radial-gradient(at 50% 90%, rgba(168, 85, 247, 0.12) 0px, transparent 48%)',
    surface: '#FFFFFF',
    surfaceMuted: '#F3E8FF',
    text: '#2E1065',
    textMuted: '#6B21A8',
    border: 'rgba(168, 85, 247, 0.16)',
    accent: '#9333EA',
    accentFg: '#FFFFFF',
    accentSoft: 'rgba(147, 51, 234, 0.10)',
    headerBg: 'rgba(250, 245, 255, 0.88)',
    themeColorMeta: '#9333EA',
  },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function resolveMoodTokens(config: MoodConfig): MoodThemeTokens {
  if (config.mood !== 'picker') {
    return PRESET_MOODS[config.mood] || PRESET_MOODS.default;
  }

  const accent = config.customAccent || '#2563EB';
  const bg = config.customBg || '#F8FAFC';
  const bgIsDark = getRelativeLuminance(bg) < 0.35;
  const accentIsLight = getRelativeLuminance(accent) > 0.45;
  const { r, g, b } = hexToRgb(accent);

  return {
    id: 'picker',
    swatch: accent,
    bg,
    bgPattern: `radial-gradient(at 85% 12%, rgba(${r}, ${g}, ${b}, 0.14) 0px, transparent 45%)`,
    surface: bgIsDark ? '#1E293B' : '#FFFFFF',
    surfaceMuted: bgIsDark ? '#334155' : '#F1F5F9',
    text: bgIsDark ? '#F8FAFC' : '#0F172A',
    textMuted: bgIsDark ? '#CBD5E1' : '#475569',
    border: bgIsDark ? 'rgba(248, 250, 252, 0.14)' : 'rgba(15, 23, 42, 0.10)',
    accent,
    accentFg: accentIsLight ? '#0F172A' : '#FFFFFF',
    accentSoft: `rgba(${r}, ${g}, ${b}, 0.12)`,
    headerBg: bgIsDark ? 'rgba(15, 23, 42, 0.86)' : 'rgba(255, 255, 255, 0.86)',
    themeColorMeta: accent,
  };
}

export function applyMoodToDocument(config: MoodConfig): void {
  const tokens = resolveMoodTokens(config);
  const root = document.documentElement;
  root.style.setProperty('--app-bg', tokens.bg);
  root.style.setProperty('--app-bg-pattern', tokens.bgPattern);
  root.style.setProperty('--app-surface', tokens.surface);
  root.style.setProperty('--app-surface-muted', tokens.surfaceMuted);
  root.style.setProperty('--app-text', tokens.text);
  root.style.setProperty('--app-text-muted', tokens.textMuted);
  root.style.setProperty('--app-border', tokens.border);
  root.style.setProperty('--app-accent', tokens.accent);
  root.style.setProperty('--app-accent-fg', tokens.accentFg);
  root.style.setProperty('--app-accent-soft', tokens.accentSoft);
  root.style.setProperty('--app-header-bg', tokens.headerBg);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', tokens.themeColorMeta);
  }
}
