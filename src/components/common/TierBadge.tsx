import React from 'react';
import { UserTier } from '../../types';
import { ShieldCheck, Award, Building2, User } from 'lucide-react';

interface TierBadgeProps {
  tier: UserTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const TIER_CONFIG: Record<UserTier, {
  label: string;
  labelHindi: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  icon: React.ElementType;
  description: string;
}> = {
  citizen: {
    label: 'Citizen',
    labelHindi: 'नागरिक',
    badgeBg: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    icon: User,
    description: 'Basic verified mobile user'
  },
  local_verified: {
    label: 'Local Verified',
    labelHindi: 'स्थानीय प्रमाणित',
    badgeBg: 'bg-teal-50',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-300',
    icon: ShieldCheck,
    description: 'Pincode & residency verified. Can cast Quorum votes.'
  },
  expert: {
    label: 'Credentialed Expert',
    labelHindi: 'प्रमाणित विशेषज्ञ',
    badgeBg: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-400',
    icon: Award,
    description: 'Academic/Technical credentials verified. Can grant Expert Approval.'
  },
  institution: {
    label: 'Institutional Lead',
    labelHindi: 'संस्था / विभाग',
    badgeBg: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-300',
    icon: Building2,
    description: 'Govt Department, University or CSR Implementing Body.'
  }
};

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.citizen;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      id={`tier-badge-${tier}`}
      title={config.description}
      className={`inline-flex items-center rounded-full border ${config.badgeBg} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} shadow-2xs whitespace-nowrap cursor-help ${className}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0 text-current`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
