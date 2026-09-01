import React, { useState } from 'react';
import { User, UserTier } from '../../types';
import { TierBadge, TIER_CONFIG } from '../common/TierBadge';
import { LocationVerificationForm } from './LocationVerificationForm';
import { ExpertApplicationForm } from './ExpertApplicationForm';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building2,
  X,
  UserCheck
} from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';

interface AccountTierStatusProps {
  currentUser: User;
  onUserUpdated: (user: User) => void;
  language?: 'en' | 'hi';
}

export const AccountTierStatus: React.FC<AccountTierStatusProps> = ({
  currentUser,
  onUserUpdated,
  language = 'en'
}) => {
  const [activeModal, setActiveModal] = useState<'location' | 'expert' | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const tier = currentUser.tier;

  const handleLocationSuccess = (updatedUser: User) => {
    onUserUpdated(updatedUser);
    setActiveModal(null);
    setSuccessToast(
      language === 'hi'
        ? 'बधाई! आपका स्थानीय निवास सत्यापित हो गया है। आप अब कोरम मतदान कर सकते हैं।'
        : 'Congratulations! Your local residency is verified. You now have Tier 2 Quorum Voting rights.'
    );
    setTimeout(() => setSuccessToast(null), 6000);
  };

  const handleExpertSuccess = (res: { autoApproved: boolean; updatedUser?: User }) => {
    if (res.autoApproved && res.updatedUser) {
      onUserUpdated(res.updatedUser);
      setSuccessToast(
        language === 'hi'
          ? 'बधाई! संस्थागत ईमेल द्वारा आपकी विशेषज्ञता तुरंत स्वीकृत हो गई है।'
          : 'Instant Approval! Tier 3 Expert status granted via verified academic domain.'
      );
    } else {
      setSuccessToast(
        language === 'hi'
          ? 'आपका विशेषज्ञ आवेदन सफलतापूर्वक जमा कर दिया गया है। एडमिन समीक्षाधीन है।'
          : 'Expert application submitted successfully. It is now queued in the Admin Moderation Panel for review.'
      );
    }
    setActiveModal(null);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  return (
    <div id="account-tier-status-widget" className="space-y-4">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-3.5 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Tier Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">{currentUser.name || 'Citizen'}</h3>
                <TierBadge tier={currentUser.tier} size="sm" />
                {currentUser.isAdmin && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>
                  {currentUser.block}, {currentUser.district} ({currentUser.pincode})
                </span>
                <span>•</span>
                <span className="font-semibold text-teal-800">
                  Trust Score: {currentUser.trustScore}/100
                </span>
              </p>
            </div>
          </div>

          {/* Quick Status Pill */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {tier === 'citizen' && (
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Tier 1: Standard Citizen
              </span>
            )}
            {tier === 'local_verified' && (
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Tier 2: Quorum Voter
              </span>
            )}
            {tier === 'expert' && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Tier 3: Technical Approver
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Upgrade CTAs */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Civic Tier Capabilities & Next Upgrades:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* TIER 2: LOCAL VERIFICATION UPGRADE CTA */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentUser.verifiedLocation || tier === 'local_verified' || tier === 'expert' || tier === 'institution'
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        currentUser.verifiedLocation ? 'text-emerald-600' : 'text-blue-600'
                      }`}
                    />
                    <h4 className="text-xs font-bold text-slate-900">
                      Tier 2: Local Verified Resident
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Verify voter ID / ration card in your pincode to participate in 10-vote proposal quorum.
                  </p>
                </div>

                {currentUser.verifiedLocation || tier === 'local_verified' || tier === 'expert' || tier === 'institution' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <button
                    id="btn-open-location-verify"
                    type="button"
                    onClick={() => setActiveModal('location')}
                    className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                  >
                    Verify Location
                  </button>
                )}
              </div>
            </div>

            {/* TIER 3: EXPERT APPLICATION CTA */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                tier === 'expert' || tier === 'institution'
                  ? 'border-amber-200 bg-amber-50/40'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award
                      className={`w-4 h-4 ${
                        tier === 'expert' ? 'text-amber-600' : 'text-slate-500'
                      }`}
                    />
                    <h4 className="text-xs font-bold text-slate-900">Tier 3: Domain Expert Status</h4>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    University faculty & researchers approve technical feasibility with .ac.in auto-validation.
                  </p>
                </div>

                {tier === 'expert' || tier === 'institution' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-xl shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Expert
                  </span>
                ) : (
                  <button
                    id="btn-open-expert-apply"
                    type="button"
                    onClick={() => setActiveModal('expert')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                  >
                    Apply as Expert
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: LOCATION VERIFICATION */}
      {activeModal === 'location' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <LocationVerificationForm
              userId={currentUser.id}
              initialDistrict={currentUser.district}
              initialBlock={currentUser.block}
              initialPincode={currentUser.pincode}
              onSuccess={handleLocationSuccess}
              onCancel={() => setActiveModal(null)}
              language={language}
            />
          </div>
        </div>
      )}

      {/* MODAL: EXPERT APPLICATION */}
      {activeModal === 'expert' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            <ExpertApplicationForm
              currentUser={currentUser}
              onSuccess={handleExpertSuccess}
              onCancel={() => setActiveModal(null)}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};
