import React from 'react';
import { SearchX, Inbox, LucideIcon } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  title: string;
  description: string;
  hindiDescription?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  hindiDescription,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      id="empty-state-box"
      className={`text-center py-12 px-6 bg-white rounded-2xl border border-slate-200 shadow-2xs max-w-md mx-auto my-6 ${className}`}
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3.5 border border-slate-200">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      {hindiDescription && (
        <p className="text-[11px] text-slate-400 mt-0.5">{hindiDescription}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <PrimaryButton variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
