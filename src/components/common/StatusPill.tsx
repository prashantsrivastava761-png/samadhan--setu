import React from 'react';
import { ProblemStatus } from '../../types';
import { CheckCircle2, Clock, MessageSquare, Lightbulb, ShieldCheck, Wrench, CheckCircle } from 'lucide-react';

interface StatusPillProps {
  status: ProblemStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const STATUS_CONFIG: Record<ProblemStatus, {
  label: string;
  labelHindi: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  icon: React.ElementType;
}> = {
  filed: {
    label: 'Filed',
    labelHindi: 'दर्ज किया गया',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
    icon: Clock
  },
  discussing: {
    label: 'Discussing',
    labelHindi: 'सामुदायिक चर्चा',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-600',
    icon: MessageSquare
  },
  proposed: {
    label: 'Proposed',
    labelHindi: 'समाधान प्रस्तावित',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    icon: Lightbulb
  },
  verified: {
    label: 'Verified',
    labelHindi: 'सत्यापित समाधान',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    dot: 'bg-emerald-600',
    icon: ShieldCheck
  },
  in_progress: {
    label: 'In Progress',
    labelHindi: 'कार्य प्रगति पर',
    bg: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-300',
    dot: 'bg-cyan-600',
    icon: Wrench
  },
  resolved: {
    label: 'Resolved',
    labelHindi: 'समाधान पूर्ण',
    bg: 'bg-teal-50',
    text: 'text-teal-900',
    border: 'border-teal-400',
    dot: 'bg-teal-600',
    icon: CheckCircle
  }
};

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.filed;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      id={`status-pill-${status}`}
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} tracking-tight whitespace-nowrap shadow-xs ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
