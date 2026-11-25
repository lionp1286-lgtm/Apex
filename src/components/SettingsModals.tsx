import React, { useState } from 'react';
import { X, Star, Download, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type {
  LanguageCode,
  PrivacyPreferences,
  RatingRecord,
  UserAccount,
} from '../types/apex';
import type { SettingsModalType } from './SettingsDrawer';
import { t } from '../data/i18n';

interface SettingsModalsProps {
  activeModal: SettingsModalType;
  language: LanguageCode;
  account: UserAccount;
  privacy: PrivacyPreferences;
  rating: RatingRecord | null;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
  onUpdatePrivacy: (next: PrivacyPreferences) => void;
  onExportData: () => void;
  onResetAll: () => void;
  onSaveRating: (stars: number, comment: string) => void;
}

export const SettingsModals: React.FC<SettingsModalsProps> = ({
  activeModal,
  language,
  account,
  privacy,
  rating,
  onClose,
  onLogin,
  onUpdatePrivacy,
  onExportData,
  onResetAll,
  onSaveRating,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [nameInput, setNameInput] = useState(account.name || '');
  const [emailInput, setEmailInput] = useState(account.email || '');
  const [passwordInput, setPasswordInput] = useState('');

  const [confirmReset, setConfirmReset] = useState(false);

  const [stars, setStars] = useState(rating?.stars || 5);
  const [ratingComment, setRatingComment] = useState(rating?.comment || '');
  const [ratingSaved, setRatingSaved] = useState(false);

  const [contactTopic, setContactTopic] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  if (!activeModal) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || emailInput.split('@')[0] || 'User';
    if (!emailInput.trim()) return;
    onLogin(finalName, emailInput.trim());
    setPasswordInput('');
    onClose();
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRating(stars, ratingComment.trim());
    setRatingSaved(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTopic.trim() || !contactMessage.trim()) return;
    setContactSent(true);
    setContactTopic('');
    setContactMessage('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: 'var(--app-surface)',
            color: 'var(--app-text)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold">
              {activeModal === 'auth' &&
                (isSignUp ? t(language, 'authTitleSignUp') : t(language, 'authTitleSignIn'))}
              {activeModal === 'privacy' && t(language, 'privacyTitle')}
              {activeModal === 'help' && t(language, 'helpTitle')}
              {activeModal === 'rating' && t(language, 'ratingTitle')}
              {activeModal === 'contact' && t(language, 'contactTitle')}
            </h2>
            <button
              type="button"
              onClick={() => {
                setConfirmReset(false);
                setRatingSaved(false);
                setContactSent(false);
                onClose();
              }}
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

          {/* Auth Modal */}
          {activeModal === 'auth' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5">{t(language, 'nameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--app-surface-muted)',
                      border: '1px solid var(--app-border)',
                    }}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold mb-1.5">{t(language, 'emailLabel')}</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--app-surface-muted)',
                    border: '1px solid var(--app-border)',
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">{t(language, 'passwordLabel')}</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--app-surface-muted)',
                    border: '1px solid var(--app-border)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl py-3 text-sm font-semibold min-h-[46px]"
                style={{
                  backgroundColor: 'var(--app-accent)',
                  color: 'var(--app-accent-fg)',
                }}
              >
                {isSignUp ? t(language, 'createAccountBtn') : t(language, 'signInBtn')}
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-xs font-semibold py-2"
                style={{ color: 'var(--app-text-muted)' }}
              >
                {isSignUp ? t(language, 'authSwitchToSignIn') : t(language, 'authSwitchToSignUp')}
              </button>
            </form>
          )}

          {/* Privacy & Account Management */}
          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
                {t(language, 'privacySummary')}
              </p>

              <label
                className="flex items-center justify-between rounded-xl p-3.5 cursor-pointer"
                style={{ backgroundColor: 'var(--app-surface-muted)' }}
              >
                <span className="text-sm font-medium">{t(language, 'soundAlertsLabel')}</span>
                <input
                  type="checkbox"
                  checked={privacy.soundEnabled}
                  onChange={(e) =>
                    onUpdatePrivacy({ ...privacy, soundEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-current"
                />
              </label>

              <button
                type="button"
                onClick={onExportData}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold min-h-[44px]"
                style={{
                  backgroundColor: 'var(--app-surface-muted)',
                  border: '1px solid var(--app-border)',
                }}
              >
                <Download className="w-4 h-4" />
                <span>{t(language, 'exportDataBtn')}</span>
              </button>

              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-red-600 min-h-[44px]"
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.25)',
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t(language, 'resetProgressBtn')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onResetAll();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="w-full rounded-xl py-3 px-4 text-sm font-semibold bg-red-600 text-white min-h-[44px]"
                >
                  {t(language, 'confirmResetBtn')}
                </button>
              )}
            </div>
          )}

          {/* Help Center */}
          {activeModal === 'help' && (
            <div className="space-y-3.5">
              {[
                { title: t(language, 'helpStep1Title'), desc: t(language, 'helpStep1Desc') },
                { title: t(language, 'helpStep2Title'), desc: t(language, 'helpStep2Desc') },
                { title: t(language, 'helpStep3Title'), desc: t(language, 'helpStep3Desc') },
              ].map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: 'var(--app-surface-muted)' }}
                >
                  <h3 className="text-sm font-bold">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Your Rating */}
          {activeModal === 'rating' && (
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
                {t(language, 'ratingDesc')}
              </p>

              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setStars(value);
                      setRatingSaved(false);
                    }}
                    aria-label={`${value} stars`}
                    className="p-2 rounded-xl transition-transform active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Star
                      className="w-7 h-7"
                      fill={value <= stars ? '#F59E0B' : 'none'}
                      stroke={value <= stars ? '#F59E0B' : 'currentColor'}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={ratingComment}
                onChange={(e) => {
                  setRatingComment(e.target.value);
                  setRatingSaved(false);
                }}
                placeholder={t(language, 'ratingNotesPlaceholder')}
                className="w-full rounded-xl p-3 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--app-surface-muted)',
                  border: '1px solid var(--app-border)',
                }}
              />

              {ratingSaved ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t(language, 'ratingThanks', { stars })}</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-xl py-3 text-sm font-semibold min-h-[46px]"
                  style={{
                    backgroundColor: 'var(--app-accent)',
                    color: 'var(--app-accent-fg)',
                  }}
                >
                  {t(language, 'submitRating')}
                </button>
              )}
            </form>
          )}

          {/* Contact Us */}
          {activeModal === 'contact' && (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
                {t(language, 'contactDesc')}
              </p>

              {contactSent ? (
                <div
                  className="rounded-2xl p-4 flex items-center gap-2.5 text-sm font-semibold text-emerald-600"
                  style={{ backgroundColor: 'var(--app-surface-muted)' }}
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{t(language, 'contactSent')}</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">{t(language, 'topicLabel')}</label>
                    <input
                      type="text"
                      required
                      value={contactTopic}
                      onChange={(e) => setContactTopic(e.target.value)}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                      style={{
                        backgroundColor: 'var(--app-surface-muted)',
                        border: '1px solid var(--app-border)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">{t(language, 'messageLabel')}</label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full rounded-xl p-3 text-sm outline-none"
                      style={{
                        backgroundColor: 'var(--app-surface-muted)',
                        border: '1px solid var(--app-border)',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl py-3 text-sm font-semibold min-h-[46px]"
                    style={{
                      backgroundColor: 'var(--app-accent)',
                      color: 'var(--app-accent-fg)',
                    }}
                  >
                    {t(language, 'sendMessage')}
                  </button>
                </>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
