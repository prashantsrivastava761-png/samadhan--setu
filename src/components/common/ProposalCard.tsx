import React, { useState } from 'react';
import { Proposal, UserTier, ImplementerType } from '../../types';
import { TierBadge } from './TierBadge';
import { VerifiedBadge } from './VerifiedBadge';
import { PrimaryButton } from './PrimaryButton';
import {
  ThumbsUp,
  ShieldCheck,
  Award,
  Clock,
  IndianRupee,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
  currentUserTier: UserTier;
  currentUserId: string;
  onUpvoteProposal: (proposalId: string) => void;
  onCastQuorumVote: (proposalId: string) => void;
  onApproveAsExpert: (proposalId: string, justification: string) => void;
  onClaimProposal?: (proposalId: string) => void;
  onRequestUpgradeToLocal: () => void;
  onRequestUpgradeToExpert: () => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  currentUserTier,
  currentUserId,
  onUpvoteProposal,
  onCastQuorumVote,
  onApproveAsExpert,
  onClaimProposal,
  onRequestUpgradeToLocal,
  onRequestUpgradeToExpert
}) => {
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [expertJustification, setExpertJustification] = useState<string>('');
  const [justificationError, setJustificationError] = useState<string>('');

  const hasQuorumVoted = proposal.quorumVoters.includes(currentUserId);
  const isQuorumMet = proposal.quorumVotes >= proposal.requiredQuorum;
  const isFullyVerified = proposal.expertApproved || isQuorumMet;

  const handleExpertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertJustification.trim() || expertJustification.length < 15) {
      setJustificationError('Please provide a technical justification of at least 15 characters.');
      return;
    }
    onApproveAsExpert(proposal.id, expertJustification);
    setShowExpertModal(false);
    setExpertJustification('');
    setJustificationError('');
  };

  const getImplementerBadge = (type: ImplementerType) => {
    switch (type) {
      case 'government':
        return { label: 'Govt Department', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'university':
        return { label: 'University / Research', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'industry_ngo':
        return { label: 'Industry / CSR / NGO', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
  };

  const implementerInfo = getImplementerBadge(proposal.implementerType);

  return (
    <div
      id={`proposal-card-${proposal.id}`}
      className={`rounded-2xl border bg-white p-4 sm:p-5 transition-all shadow-xs ${
        isFullyVerified ? 'border-emerald-300 ring-1 ring-emerald-400/20' : 'border-slate-200'
      }`}
    >
      {/* Header & Verification status */}
      <div className="flex flex-wrap items-start justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${implementerInfo.bg}`}>
            {implementerInfo.label}
          </span>
          {proposal.expertApproved ? (
            <VerifiedBadge type="expert" expertName={proposal.expertApprover?.name} />
          ) : isQuorumMet ? (
            <VerifiedBadge type="quorum" votesCount={proposal.quorumVotes} requiredVotes={proposal.requiredQuorum} />
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              Verification Pending
            </span>
          )}
        </div>

        {/* Upvote button */}
        <button
          type="button"
          onClick={() => onUpvoteProposal(proposal.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
            proposal.hasUpvoted
              ? 'bg-teal-50 border-teal-300 text-teal-800'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${proposal.hasUpvoted ? 'fill-teal-700 text-teal-700' : ''}`} />
          <span>{proposal.upvotes} Upvotes</span>
        </button>
      </div>

      {/* Title & Approach */}
      <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
        {proposal.title}
      </h4>
      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
        {proposal.approachSummary}
      </p>

      {/* Meta grid: Cost & Timeframe */}
      <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 block">Estimated Budget</span>
            <strong className="text-slate-900 font-semibold">{proposal.estimatedCost}</strong>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 block">Target Timeline</span>
            <strong className="text-slate-900 font-semibold">{proposal.estimatedTimeframe}</strong>
          </div>
        </div>
      </div>

      {/* Proposer Info */}
      <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <img
            src={proposal.proposedBy.avatar}
            alt={proposal.proposedBy.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-semibold text-slate-800 block leading-tight">
              {proposal.proposedBy.name}
            </span>
            {proposal.proposedBy.affiliation && (
              <span className="text-[10px] text-slate-500 leading-none">
                {proposal.proposedBy.affiliation}
              </span>
            )}
          </div>
        </div>
        <TierBadge tier={proposal.proposedBy.tier} size="sm" />
      </div>

      {/* Quorum Progress Bar Section */}
      <div className="mt-4 p-3 rounded-xl bg-slate-100/80 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            Citizen Quorum Verification
          </span>
          <span className={isQuorumMet ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
            {proposal.quorumVotes} of {proposal.requiredQuorum} votes {isQuorumMet ? '✓ (Quorum Met)' : ''}
          </span>
        </div>

        {/* Progress meter */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isQuorumMet ? 'bg-emerald-600' : 'bg-teal-600'
            }`}
            style={{ width: `${Math.min(100, (proposal.quorumVotes / proposal.requiredQuorum) * 100)}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-500">
          5 local verified residents or 1 certified domain expert endorsement certifies this proposal for institutional adoption.
        </p>
      </div>

      {/* Expert endorsement endorsement note if active */}
      {proposal.expertApproved && proposal.expertApprover && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Award className="w-4 h-4 text-amber-600" />
            Expert Endorsement: {proposal.expertApprover.name} ({proposal.expertApprover.organization})
          </div>
          <p className="text-slate-700 italic text-[11px]">
            "{proposal.expertApprover.justification}"
          </p>
        </div>
      )}

      {/* Claimed Status if applicable */}
      {proposal.claimedBy && (
        <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <span className="font-semibold flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-700" />
            Implementation Claimed by: {proposal.claimedBy.name}
          </span>
          <span className="text-[11px] text-blue-700">Status: {proposal.status.toUpperCase()}</span>
        </div>
      )}

      {/* ACTION BAR: Contextual buttons per user tier (Screen 6 Requirement!) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Tier-specific Action Button */}
        {currentUserTier === 'expert' ? (
          <div>
            {proposal.expertApproved ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> Endorsed by Expert Committee
              </span>
            ) : (
              <PrimaryButton
                variant="accent"
                size="sm"
                leftIcon={<Award className="w-3.5 h-3.5" />}
                onClick={() => setShowExpertModal(true)}
              >
                Approve as Credentialed Expert
              </PrimaryButton>
            )}
          </div>
        ) : currentUserTier === 'local_verified' ? (
          <div>
            <PrimaryButton
              variant={hasQuorumVoted ? 'outline' : 'primary'}
              size="sm"
              leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              disabled={hasQuorumVoted}
              onClick={() => onCastQuorumVote(proposal.id)}
            >
              {hasQuorumVoted ? 'You Added Quorum Vote ✓' : 'Add Local Quorum Vote'}
            </PrimaryButton>
          </div>
        ) : currentUserTier === 'institution' ? (
          <div>
            {proposal.status === 'open' || proposal.status === 'verified' ? (
              <PrimaryButton
                variant="primary"
                size="sm"
                leftIcon={<Building2 className="w-3.5 h-3.5" />}
                onClick={() => onClaimProposal?.(proposal.id)}
              >
                Claim Proposal for Execution
              </PrimaryButton>
            ) : (
              <span className="text-xs font-bold text-blue-800">
                Claimed & Under Action
              </span>
            )}
          </div>
        ) : (
          /* Basic Citizen Tier: Disabled button with nudge to verify pincode */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRequestUpgradeToLocal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-300 text-xs font-medium transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Verify your location to vote</span>
            </button>
            <button
              type="button"
              onClick={onRequestUpgradeToExpert}
              className="text-[11px] text-teal-700 hover:underline font-semibold"
            >
              Are you an expert?
            </button>
          </div>
        )}

        {/* Milestone preview link or count */}
        {proposal.keyMilestones && proposal.keyMilestones.length > 0 && (
          <span className="text-[11px] text-slate-500 font-medium">
            {proposal.keyMilestones.length} Roadmap Steps
          </span>
        )}
      </div>

      {/* Expert Justification Modal */}
      {showExpertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Expert Technical Endorsement</h3>
                  <p className="text-xs text-slate-500">Official review on behalf of your institution</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleExpertSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Evaluating Proposal:
                </label>
                <p className="text-xs text-slate-900 bg-slate-50 p-2 rounded-lg font-medium border border-slate-200">
                  {proposal.title}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Justification & Feasibility Assessment *
                </label>
                <textarea
                  rows={3}
                  value={expertJustification}
                  onChange={(e) => {
                    setExpertJustification(e.target.value);
                    if (justificationError) setJustificationError('');
                  }}
                  placeholder="State technical efficacy, hydrological/structural viability, or safety parameters (e.g., WHO standards compliance, local maintenance ease)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {justificationError && (
                  <p className="text-[11px] text-rose-600 mt-1">{justificationError}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
                <p className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Public Audit Notice:
                </p>
                Your name, university/department affiliation, and this justification will be permanently stamped on the proposal ledger.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExpertModal(false)}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  variant="accent"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Confirm Expert Approval
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
