import React from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none shadow-xs';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[44px]', // 44px touch target on mobile!
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[50px]'
  };

  const variantClasses = {
    // Primary: Deep Teal / Government Navy
    primary:
      'bg-teal-700 hover:bg-teal-800 text-white border border-teal-800 focus:ring-4 focus:ring-teal-700/20 shadow-teal-900/10',
    // Secondary: Warm subtle neutral
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 focus:ring-4 focus:ring-slate-400/20',
    // Accent: Saffron / Warm Amber for key civic CTAs
    accent:
      'bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 focus:ring-4 focus:ring-amber-500/25 shadow-amber-900/15',
    // Outline: crisp border
    outline:
      'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300 focus:ring-4 focus:ring-slate-300/30',
    // Ghost: text only
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 shadow-none',
    // Danger: for warnings / alerts
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 focus:ring-4 focus:ring-rose-500/20'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
