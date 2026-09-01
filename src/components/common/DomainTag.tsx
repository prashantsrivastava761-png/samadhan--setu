import React from 'react';
import { DomainType } from '../../types';
import { DOMAIN_CONFIG } from '../../data/mockData';
import {
  Droplet,
  HeartPulse,
  GraduationCap,
  Sprout,
  Construction,
  Zap,
  Trash2,
  Trees,
  Tag
} from 'lucide-react';

interface DomainTagProps {
  domain: DomainType;
  showHindi?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Droplet,
  HeartPulse,
  GraduationCap,
  Sprout,
  Construction,
  Zap,
  Trash2,
  Trees
};

export const DomainTag: React.FC<DomainTagProps> = ({
  domain,
  showHindi = false,
  size = 'md',
  className = ''
}) => {
  const config = DOMAIN_CONFIG[domain] || {
    label: domain,
    hindi: domain,
    color: '#64748b',
    bgLight: 'bg-slate-50',
    textDark: 'text-slate-800',
    border: 'border-slate-200',
    iconName: 'Tag'
  };

  const Icon = ICON_MAP[config.iconName] || Tag;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  };

  return (
    <span
      id={`domain-tag-${domain}`}
      className={`inline-flex items-center rounded-lg border ${config.bgLight} ${config.textDark} ${config.border} ${sizeClasses[size]} whitespace-nowrap transition-colors ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
      <span>{config.label}</span>
      {showHindi && <span className="opacity-75 text-[10px]">({config.hindi})</span>}
    </span>
  );
};
