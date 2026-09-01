import React, { useState } from 'react';
import { User, Problem, Proposal, ProgressUpdate } from '../../types';
import { TierBadge, TIER_CONFIG } from '../common/TierBadge';
import { StatusPill } from '../common/StatusPill';
import { DomainTag } from '../common/DomainTag';
import { PrimaryButton } from '../common/PrimaryButton';
import { AccountTierStatus } from '../auth/AccountTierStatus';
import { LogoutButton } from '../auth/LogoutButton';
import {
  ShieldCheck,
  Award,
  Star,
  MapPin,
  Phone,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';

interface ProfileTrustPageProps {
  currentUser: User;
  problems: Problem[];
  proposals: Proposal[];
  progressUpdates: ProgressUpdate[];
  onSelectProblem: (problem: Problem) => void;
  onRequestUpgradeToLocal: () => void;
  onRequestUpgradeToExpert: () => void;
  onUserUpdated?: (user: User) => void;
  onLoggedOut?: () => void;
  language?: 'en' | 'hi';
}

export const ProfileTrustPage: React.FC<ProfileTrustPageProps> = ({
  currentUser,
  problems,
  proposals,
  progressUpdates,
  onSelectProblem,
  onRequestUpgradeToLocal,
  onRequestUpgradeToExpert,
  onUserUpdated = () => {},
  onLoggedOut = () => {},
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'filed' | 'verifications' | 'updates'>('filed');

  const myFiledProblems = problems.filter((p) => p.filedBy.id === currentUser.id);

  // Trust score tier status
  const getTrustRating = (score: number) => {
    if (score >= 90) return { label: 'Distinguished Civic Anchor', color: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (score >= 70) return { label: 'High Trust Community Monitor', color: 'text-teal-700', bg: 'bg-teal-50' };
    if (score >= 50) return { label: 'Verified Local Contributor', color: 'text-blue-700', bg: 'bg-blue-50' };
    return { label: 'Standard Registered Citizen', color: 'text-slate-700', bg: 'bg-slate-100' };
  };

  const trustRating = getTrustRating(currentUser.trustScore);

  return (
    <div id="profile-trust-page" className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pb-20 space-y-6">
      {/* Account Tier Status & Upgrade Widget */}
      <AccountTierStatus
        currentUser={currentUser}
        onUserUpdated={onUserUpdated}
        language={language}
      />

      {/* Profile & Trust Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Avatar & User Details */}
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-700/30 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentUser.name}
                </h1>
                <TierBadge tier={currentUser.tier} size="md" />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                {currentUser.block}, {currentUser.district} (Pincode: {currentUser.pincode})
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Phone: {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Trust Score Radial / Box */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-md border border-teal-700/50">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400"
                    strokeDasharray={`${currentUser.trustScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-base font-black text-amber-300">
                  {currentUser.trustScore}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider block">
                  Civic Trust Score
                </span>
                <p className="text-xs font-bold text-white mt-0.5">
                  {trustRating.label}
                </p>
                <p className="text-[10px] text-teal-200/70">
                  High credibility for voting & evidence
                </p>
              </div>
            </div>

            <LogoutButton onLoggedOut={onLoggedOut} language={language} />
          </div>
        </div>

        {/* Tier Upgrade Nudge if not already maximum */}
        {currentUser.tier === 'citizen' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Upgrade to Local Verified Tier
              </h4>
              <p className="text-amber-800">
                Verify your residency pincode to participate in community quorums and fast-track neighborhood funding.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PrimaryButton
                variant="accent"
                size="sm"
                onClick={onRequestUpgradeToLocal}
              >
                Verify Pincode Now
              </PrimaryButton>
              <button
                type="button"
                onClick={onRequestUpgradeToExpert}
                className="text-xs text-amber-900 hover:underline font-bold px-2"
              >
                Apply as Expert
              </button>
            </div>
          </div>
        )}

        {currentUser.tier === 'local_verified' && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-700" />
                Are you a University Faculty, Engineer or Doctor?
              </h4>
              <p className="text-teal-900">
                Apply for Credentialed Expert status to grant official Technical Approvals on civic engineering proposals.
              </p>
            </div>
            <PrimaryButton
              variant="primary"
              size="sm"
              onClick={onRequestUpgradeToExpert}
            >
              Apply as Expert
            </PrimaryButton>
          </div>
        )}

        {/* Trust Score Breakdown Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[11px]">Filed Problems</span>
            <strong className="text-slate-900 text-base font-bold">
              {currentUser.stats.filedCount}
            </strong>
            <span className="text-[10px] text-emerald-600 block font-semibold">+15 pts per verified</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[11px]">Quorum Votes Given</span>
            <strong className="text-slate-900 text-base font-bold">
              {currentUser.stats.verificationsCount}
            </strong>
            <span className="text-[10px] text-emerald-600 block font-semibold">+5 pts per vote</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[11px]">Progress Updates</span>
            <strong className="text-slate-900 text-base font-bold">
              {currentUser.stats.updatesCount}
            </strong>
            <span className="text-[10px] text-emerald-600 block font-semibold">+10 pts per photo proof</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[11px]">Support Upvotes</span>
            <strong className="text-slate-900 text-base font-bold">
              {currentUser.stats.upvotesGiven}
            </strong>
            <span className="text-[10px] text-slate-400 block font-medium">Community Karma</span>
          </div>
        </div>
      </div>

      {/* Tier Progression Roadmap */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-700" />
          Civic Tier Progression Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              tierKey: 'citizen',
              title: 'Citizen',
              desc: 'Basic mobile verified citizen. Can report problems, upvote, and join petitions.',
              unlocked: true
            },
            {
              tierKey: 'local_verified',
              title: 'Local Verified',
              desc: 'Residency confirmed via Pincode. Unlocks 1 of 5 Quorum voting rights.',
              unlocked: currentUser.tier === 'local_verified' || currentUser.tier === 'expert' || currentUser.tier === 'institution'
            },
            {
              tierKey: 'expert',
              title: 'Credentialed Expert',
              desc: 'University faculty, engineers, or medical officers. Can grant full Expert Approvals.',
              unlocked: currentUser.tier === 'expert' || currentUser.tier === 'institution'
            },
            {
              tierKey: 'institution',
              title: 'Institutional Lead',
              desc: 'Govt departments & University bodies. Can officially claim proposals for fund execution.',
              unlocked: currentUser.tier === 'institution'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                item.unlocked
                  ? 'bg-teal-50/60 border-teal-300 text-teal-950 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{item.title}</span>
                {item.unlocked ? (
                  <Unlock className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <p className="text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History Tabs: Filed Problems | Verifications | Field Updates */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('filed')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'filed'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Filed Grievances ({myFiledProblems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'verifications'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Quorum Verifications ({currentUser.stats.verificationsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('updates')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'updates'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Field Proofs Contributed ({currentUser.stats.updatesCount})
          </button>
        </div>

        {activeTab === 'filed' && (
          <div className="space-y-3">
            {myFiledProblems.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                You haven't filed any civic problems yet.
              </p>
            ) : (
              myFiledProblems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => onSelectProblem(prob)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-600 bg-slate-50/70 hover:bg-white cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DomainTag domain={prob.domain} size="sm" />
                      <StatusPill status={prob.status} size="sm" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {prob.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      📍 {prob.block}, {prob.district} • 👥 {prob.affectedCount} affected • 👍 {prob.upvotes} supporters
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-600">
              Verified records stamped with your citizen key:
            </p>
            {[
              { id: '1', title: 'Water quality & heavy metal test in Salgadih, Tamar', date: '2026-08-16', quorum: '5 of 5 reached' },
              { id: '2', title: 'Solar micro-cold storage feasibility in Ormanjhi Kisan Haat', date: '2026-08-10', quorum: '5 of 5 reached' },
              { id: '3', title: 'Subarnarekha culvert height clearance in Chandil', date: '2026-07-18', quorum: 'Verified & Completed' }
            ].map((v) => (
              <div key={v.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{v.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Date: {v.date}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {v.quorum}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-600">
              Timestamped photo proof updates submitted from your field visits:
            </p>
            {[
              { id: '1', title: 'Solar panels and dual-stage filtration vessels delivered on site', location: 'Tamar Panchayat Store', date: '2026-08-24' },
              { id: '2', title: 'Foundation trench excavation photo proof', location: 'Ormanjhi Mandi Feeder', date: '2026-08-14' }
            ].map((u) => (
              <div key={u.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{u.title}</span>
                  <span className="text-[10px] text-slate-500">📍 {u.location} • {u.date}</span>
                </div>
                <span className="text-[11px] font-semibold text-teal-700">Geo-Stamped ✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
