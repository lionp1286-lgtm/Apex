import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import type { LanguageCode } from '../types/apex';
import { t } from '../data/i18n';

interface PWAInstallButtonProps {
  language: LanguageCode;
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language, compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 min-h-[40px]"
        style={{
          backgroundColor: 'var(--app-accent-soft)',
          color: 'var(--app-text)',
          border: '1px solid var(--app-border)',
        }}
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{compact ? t(language, 'installApp') : t(language, 'installApp')}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 min-h-[40px]"
          style={{
            backgroundColor: 'var(--app-accent-soft)',
            color: 'var(--app-text)',
            border: '1px solid var(--app-border)',
          }}
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{t(language, 'installIOS')}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
              className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
              style={{
                backgroundColor: 'var(--app-surface)',
                color: 'var(--app-text)',
                border: '1px solid var(--app-border)',
              }}
            >
              <h3 className="text-lg font-semibold">{t(language, 'installIOSTitle')}</h3>
              <div className="mt-3 space-y-2 text-sm" style={{ color: 'var(--app-text-muted)' }}>
                <p>{t(language, 'installIOSStep1')}</p>
                <p>{t(language, 'installIOSStep2')}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl py-2.5 text-sm font-semibold min-h-[44px]"
                style={{
                  backgroundColor: 'var(--app-accent)',
                  color: 'var(--app-accent-fg)',
                }}
              >
                {t(language, 'close')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
