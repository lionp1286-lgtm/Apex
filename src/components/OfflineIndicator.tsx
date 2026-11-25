import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import type { LanguageCode } from '../types/apex';
import { t } from '../data/i18n';

export const OfflineIndicator: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-4 start-4 z-40 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t(language, 'offlineBanner')}</span>
    </div>
  );
};
