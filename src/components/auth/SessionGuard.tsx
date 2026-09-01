import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginScreen } from './LoginScreen';
import { ShieldAlert, Lock, ArrowLeft, UserCheck, Shield } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';

interface SessionGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  onNavigateHome?: () => void;
  fallbackView?: React.ReactNode;
}

export const SessionGuard: React.FC<SessionGuardProps> = ({
  children,
  requireAdmin = false,
  onNavigateHome = () => {},
  fallbackView
}) => {
  const { currentUser, isAuthenticated, isAdmin, isLoading, login, language, setLanguage, switchUser } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 rounded-full border-3 border-teal-700 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated -> Show Login Screen
  if (!isAuthenticated || !currentUser) {
    if (fallbackView) return <>{fallbackView}</>;

    return (
      <LoginScreen
        onSuccess={(user) => login(user)}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  // 2. Admin Route Protection -> If route requires admin, check `is_admin = true`
  if (requireAdmin && !isAdmin) {
    return (
      <div id="unauthorized-admin-screen" className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-rose-200 shadow-md p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>HTTP 403 • ACCESS RESTRICTED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Administrative Authorization Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              You are signed in as <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.tier.toUpperCase()}), but this panel is protected by PostgreSQL Row-Level Security and restricted exclusively to verified administrators (<code className="font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded">is_admin = true</code>).
            </p>
          </div>

          {/* Quick Demo Switcher for Evaluation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 max-w-md mx-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Switch to Platform Admin for Demo:
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Sanjay Murmu</p>
                <span className="text-[11px] text-slate-500">State e-Governance Cell (is_admin=true)</span>
              </div>
              <button
                id="btn-switch-to-admin-persona"
                type="button"
                onClick={() => switchUser('admin')}
                className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Switch to Admin
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              id="btn-return-feed"
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Feed</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized -> Render requested child route
  return <>{children}</>;
};
