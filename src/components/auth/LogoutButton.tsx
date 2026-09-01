import React, { useState } from 'react';
import { LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  onLoggedOut?: () => void;
  showText?: boolean;
  language?: 'en' | 'hi';
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  variant = 'secondary',
  onLoggedOut,
  showText = true,
  language = 'en'
}) => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      if (onLoggedOut) onLoggedOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs';
      case 'ghost':
        return 'text-rose-600 hover:bg-rose-50 font-bold px-2.5 py-1.5 rounded-xl';
      case 'icon':
        return 'p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors';
      case 'secondary':
      default:
        return 'border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors';
    }
  };

  return (
    <button
      id="btn-logout"
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`inline-flex items-center gap-1.5 text-xs transition-all cursor-pointer ${getVariantStyles()} ${className}`}
      title="Sign out of Samadhan Setu"
    >
      {isLoggingOut ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      {showText && (
        <span>
          {isLoggingOut
            ? language === 'hi'
              ? 'लॉगआउट हो रहा है...'
              : 'Signing out...'
            : language === 'hi'
            ? 'लॉगआउट (Sign Out)'
            : 'Sign Out'}
        </span>
      )}
    </button>
  );
};
