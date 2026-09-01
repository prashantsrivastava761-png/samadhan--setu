import React, { useState } from 'react';
import { User, UserTier } from '../../types';
import { TierBadge } from '../common/TierBadge';
import { PrimaryButton } from '../common/PrimaryButton';
import {
  ShieldCheck,
  Plus,
  Bell,
  Globe,
  User as UserIcon,
  ChevronDown,
  LayoutGrid,
  Building2,
  BarChart3,
  Award,
  Sparkles,
  Menu,
  X,
  Lock,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  currentView: 'feed' | 'detail' | 'university' | 'analytics' | 'profile' | 'admin';
  onNavigate: (view: 'feed' | 'university' | 'analytics' | 'profile' | 'admin') => void;
  currentUser: User | null;
  onSwitchUser: (tier: UserTier | 'admin') => void;
  onOpenFileProblem: () => void;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onSwitchUser,
  onOpenFileProblem,
  onOpenAuthModal,
  onLogout = () => {},
  language,
  onToggleLanguage
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Brand Logo & Title */}
          <div
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-sm border border-teal-700">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Samadhan Setu
                </span>
                <span className="hidden sm:inline text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Jharkhand
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-hindi text-slate-500 leading-none">
                समाधान सेतु • जन समस्या निवारण मंच
              </p>
            </div>
          </div>

          {/* Desktop Navigation Switcher */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => onNavigate('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'feed' || currentView === 'detail'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-teal-700" />
              <span>Citizen Feed</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('university')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'university'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>University Hub</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'analytics'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Govt Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'admin'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-teal-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'profile'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Trust Score</span>
            </button>
          </nav>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              title="Toggle English / हिंदी"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* User Profile or Login Trigger */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-600 transition-all text-left shadow-2xs"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.name}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                    {currentUser.isAdmin ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 rounded">
                        <Lock className="w-2.5 h-2.5" /> SUPER ADMIN
                      </span>
                    ) : (
                      <TierBadge tier={currentUser.tier} size="sm" showLabel={false} />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showPersonaMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Active User Profile
                      </span>
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {currentUser.district} • {currentUser.isAdmin ? 'Role: Platform Admin (is_admin=true)' : `Trust: ${currentUser.trustScore}/100`}
                      </p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider px-2 block mb-1">
                        Switch Role for Testing:
                      </span>
                      {[
                        { key: 'admin', name: 'Sanjay Murmu', role: 'Super Admin (is_admin=true)', isAdmin: true },
                        { key: 'citizen', name: 'Birsa Marandi', tier: 'citizen', role: 'Basic Citizen (Ormanjhi)' },
                        { key: 'local_verified', name: 'Anita Devi', tier: 'local_verified', role: 'Local Verified (Quorum Voter)' },
                        { key: 'expert', name: 'Dr. Alok Soren', tier: 'expert', role: 'BAU Expert (Tier 3 Approval)' },
                        { key: 'institution', name: 'Prof. Rajeshwar Prasad', tier: 'institution', role: 'IIT ISM (Can Claim)' }
                      ].map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => {
                            onSwitchUser(p.key as any);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            (p.isAdmin && currentUser.isAdmin) || (!p.isAdmin && !currentUser.isAdmin && currentUser.tier === p.tier)
                              ? 'bg-teal-50 text-teal-900 font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{p.name}</p>
                            <span className="text-[10px] text-slate-500 block">{p.role}</span>
                          </div>
                          {((p.isAdmin && currentUser.isAdmin) || (!p.isAdmin && !currentUser.isAdmin && currentUser.tier === p.tier)) && (
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                      <button
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onNavigate('admin');
                        }}
                        className="text-[11px] text-amber-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" /> Admin Panel
                      </button>
                      <button
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onNavigate('profile');
                        }}
                        className="text-[11px] text-slate-600 font-bold hover:underline"
                      >
                        View Profile
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Sign In / Register
              </button>
            )}

            {/* Desktop Report Button */}
            <PrimaryButton
              variant="accent"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
              onClick={onOpenFileProblem}
              className="hidden sm:inline-flex"
            >
              Report Problem
            </PrimaryButton>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-1 pb-4">
            <button
              onClick={() => {
                onNavigate('feed');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                currentView === 'feed' ? 'bg-teal-800 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Citizen Feed & Map
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                currentView === 'admin' ? 'bg-teal-800 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Admin Oversight Panel
            </button>
            <button
              onClick={() => {
                onNavigate('university');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                currentView === 'university' ? 'bg-teal-800 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" /> University Implementer Hub
            </button>
            <button
              onClick={() => {
                onNavigate('analytics');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                currentView === 'analytics' ? 'bg-teal-800 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Government Analytics Dashboard
            </button>
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                currentView === 'profile' ? 'bg-teal-800 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" /> My Trust Score & Tier
            </button>
            <div className="pt-2">
              <PrimaryButton
                variant="accent"
                size="md"
                className="w-full"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  onOpenFileProblem();
                  setMobileMenuOpen(false);
                }}
              >
                Report a Civic Problem
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

