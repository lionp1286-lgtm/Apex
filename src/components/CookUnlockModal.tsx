import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CookedItemId, LanguageCode } from '../types/apex';
import { COOKABLE_ITEMS } from '../data/rewards';
import { t } from '../data/i18n';
import { DishIllustration } from './DishIllustration';

interface CookUnlockModalProps {
  isOpen: boolean;
  language: LanguageCode;
  flour: number;
  cookedItems: Record<CookedItemId, number>;
  onClose: () => void;
  onCook: (item: CookedItemId) => void;
}

export const CookUnlockModal: React.FC<CookUnlockModalProps> = ({
  isOpen,
  language,
  flour,
  cookedItems,
  onClose,
  onCook,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            style={{
              backgroundColor: 'var(--app-surface)',
              color: 'var(--app-text)',
              border: '1px solid var(--app-border)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{t(language, 'cookModalTitle')}</h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--app-text-muted)' }}>
                  {t(language, 'cookModalDesc')}
                </p>
              </div>
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

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COOKABLE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={flour < 50}
                  onClick={() => onCook(item.id)}
                  className="flex items-center justify-between gap-3 rounded-2xl p-3.5 text-start transition-transform active:scale-[0.98] disabled:opacity-50 min-h-[68px]"
                  style={{
                    backgroundColor: 'var(--app-surface-muted)',
                    border: '1px solid var(--app-border)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: item.softBg }}
                    >
                      <DishIllustration id={item.id} className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t(language, item.id)}</div>
                      <div className="text-xs font-mono-tabular" style={{ color: 'var(--app-text-muted)' }}>
                        {t(language, 'cookedItemsLabel')}: {cookedItems[item.id] || 0}
                      </div>
                    </div>
                  </div>
                  <span
                    className="rounded-lg px-2.5 py-1 text-xs font-semibold shrink-0"
                    style={{
                      backgroundColor: 'var(--app-accent)',
                      color: 'var(--app-accent-fg)',
                    }}
                  >
                    {t(language, 'cookAction')}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
