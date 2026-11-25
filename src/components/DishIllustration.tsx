import React from 'react';
import type { CookedItemId } from '../types/apex';

interface DishIllustrationProps {
  id: CookedItemId;
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({ id, className = 'w-12 h-12' }) => {
  switch (id) {
    case 'cake':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="12" y="30" width="40" height="20" rx="5" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2.5" />
          <path d="M12 36 C18 41 24 34 32 39 C40 44 46 35 52 38" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="18" y="20" width="28" height="10" rx="3" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2.5" />
          <line x1="32" y1="11" x2="32" y2="20" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 5 C35 8 34 11 32 11 C30 11 29 8 32 5 Z" fill="#F59E0B" />
        </svg>
      );
    case 'cookies':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="26" cy="36" r="14" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="40" cy="26" r="12" fill="#FCD34D" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="22" cy="33" r="2" fill="#78350F" />
          <circle cx="29" cy="40" r="2" fill="#78350F" />
          <circle cx="20" cy="41" r="1.5" fill="#78350F" />
          <circle cx="38" cy="23" r="1.8" fill="#78350F" />
          <circle cx="44" cy="28" r="2" fill="#78350F" />
          <circle cx="37" cy="30" r="1.5" fill="#78350F" />
        </svg>
      );
    case 'pizza':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M32 10 L52 48 C40 53 24 53 12 48 Z" fill="#FDE047" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M12 48 C24 53 40 53 52 48" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="27" r="3.2" fill="#DC2626" />
          <circle cx="26" cy="39" r="3.5" fill="#DC2626" />
          <circle cx="38" cy="38" r="3" fill="#DC2626" />
        </svg>
      );
    case 'burger':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M14 28 C14 18 22 14 32 14 C42 14 50 18 50 28 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
          <path d="M12 33 C17 36 22 31 27 34 C32 37 37 31 42 34 C47 37 50 33 52 33" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <rect x="13" y="36" width="38" height="7" rx="3.5" fill="#78350F" />
          <rect x="15" y="43" width="34" height="7" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="26" cy="21" r="1.3" fill="#FFFBEB" />
          <circle cx="34" cy="19" r="1.3" fill="#FFFBEB" />
          <circle cx="39" cy="23" r="1.3" fill="#FFFBEB" />
        </svg>
      );
    case 'pancakes':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <ellipse cx="32" cy="45" rx="18" ry="6" fill="#F59E0B" stroke="#92400E" strokeWidth="2.2" />
          <ellipse cx="32" cy="37" rx="17" ry="6" fill="#FBBF24" stroke="#92400E" strokeWidth="2.2" />
          <ellipse cx="32" cy="29" rx="16" ry="6" fill="#FCD34D" stroke="#92400E" strokeWidth="2.2" />
          <rect x="27" y="21" width="10" height="6" rx="1.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.8" />
        </svg>
      );
  }
};
