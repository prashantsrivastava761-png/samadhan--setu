import React, { useState } from 'react';
import { Problem, Proposal, Comment, ProgressUpdate, User, UserTier } from '../../types';
import { StatusPill, STATUS_CONFIG } from '../common/StatusPill';
import { DomainTag } from '../common/DomainTag';
import { TierBadge } from '../common/TierBadge';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { PrimaryButton } from '../common/PrimaryButton';
import { ProposalCard } from '../common/ProposalCard';
import { ProgressTimelineItem } from '../common/ProgressTimelineItem';
import { EmptyState } from '../common/EmptyState';
import {
  MapPin,
  Users,
  ThumbsUp,
  MessageSquare,
  Lightbulb,
  Wrench,
  ArrowLeft,
  Share2,
  Calendar,
  Send,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ProblemDetailProps {
  problem: Problem;
  proposals: Proposal[];
  comments: Comment[];
  progressUpdates: ProgressUpdate[];
  currentUser: User;
  onBack: () => void;
  onUpvoteProblem: (problemId: string) => void;
  onAddComment: (problemId: string, text: string) => void;
  onUpvoteComment: (commentId: string) => void;
  onUpvoteProposal: (proposalId: string) => void;
  onCastQuorumVote: (proposalId: string) => void;
  onApproveAsExpert: (proposalId: string, justification: string) => void;
  onClaimProposal?: (proposalId: string) => void;
  onOpenProposeModal: () => void;
  onOpenProgressModal: () => void;
  onRequestUpgradeToLocal: () => void;
  onRequestUpgradeToExpert: () => void;
}

const LIFECYCLE_STEPS: Array<{ key: Problem['status']; label: string; labelHindi: string }> = [
  { key: 'filed', label: '1. Filed', labelHindi: 'दर्ज' },
  { key: 'discussing', label: '2. Discussing', labelHindi: 'चर्चा' },
  { key: 'proposed', label: '3. Proposed', labelHindi: 'प्रस्तावित' },
  { key: 'verified', label: '4. Verified', labelHindi: 'सत्यापित ✓' },
  { key: 'in_progress', label: '5. In Progress', labelHindi: 'प्रगति पर' },
  { key: 'resolved', label: '6. Resolved', labelHindi: 'समाधान' }
];

export const ProblemDetail: React.FC<ProblemDetailProps> = ({
  problem,
  proposals,
  comments,
  progressUpdates,
  currentUser,
  onBack,
  onUpvoteProblem,
  onAddComment,
  onUpvoteComment,
  onUpvoteProposal,
  onCastQuorumVote,
  onApproveAsExpert,
  onClaimProposal,
  onOpenProposeModal,
  onOpenProgressModal,
  onRequestUpgradeToLocal,
  onRequestUpgradeToExpert
}) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'discussion' | 'progress'>('proposals');
  const [commentText, setCommentText] = useState<string>('');

  const currentStepIndex = LIFECYCLE_STEPS.findIndex((s) => s.key === problem.status);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(problem.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Problem link copied to clipboard! Share on WhatsApp to gather quorum votes.');
    }
  };

  return (
    <div id="problem-detail-view" className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pb-20 space-y-5">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-900 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed (वापस जाएं)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Petition</span>
          </button>
        </div>
      </div>

      {/* Main Problem Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Photo Banner with geo-stamp overlay */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-900">
          <img
            src={problem.photoUrl}
            alt={problem.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Floating Domain & Status badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 flex-wrap">
            <DomainTag domain={problem.domain} size="md" showHindi />
            <StatusPill status={problem.status} size="md" />
          </div>

          {/* Bottom GPS Stamped Info Bar */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono text-[11px] text-teal-300 border border-white/10">
                <MapPin className="w-3 h-3 text-teal-400" />
                {problem.location.lat.toFixed(4)}°N, {problem.location.lng.toFixed(4)}°E • {problem.block}, {problem.district}
              </span>
              <span className="bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold">
                Pincode: {problem.pincode}
              </span>
            </div>
          </div>
        </div>

        {/* Content & Details */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* Titles */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {problem.title}
            </h1>
            <p className="text-sm sm:text-base font-hindi text-teal-900 font-medium mt-1">
              {problem.titleHindi}
            </p>
          </div>

          {/* Civic Lifecycle Step Visualizer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>Civic Problem Lifecycle (समाधान यात्रा)</span>
              <span className="text-teal-700 font-semibold">
                Current: {STATUS_CONFIG[problem.status]?.label}
              </span>
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step.key}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      isCurrent
                        ? 'bg-teal-700 text-white border-teal-800 ring-2 ring-teal-700/30 font-bold shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold line-clamp-1">{step.label}</div>
                    <div className="text-[10px] opacity-80 line-clamp-1">{step.labelHindi}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Problem Body Description */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>{problem.description}</p>
            {problem.descriptionHindi && (
              <p className="text-slate-600 font-hindi mt-2 text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
                {problem.descriptionHindi}
              </p>
            )}
          </div>

          {/* Filer & Stats Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            {/* Filer profile */}
            <div className="flex items-center gap-3">
              <img
                src={problem.filedBy.avatar}
                alt={problem.filedBy.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {problem.filedBy.name}
                  </span>
                  <TierBadge tier={problem.filedBy.tier} size="sm" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filed on {new Date(problem.filedAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Support Actions: Upvote & Affected count */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[10px]">Impact Count</span>
                <strong className="text-slate-900 text-sm font-bold">
                  👥 {problem.affectedCount.toLocaleString()} Citizens
                </strong>
              </div>

              <PrimaryButton
                variant={problem.hasUpvoted ? 'outline' : 'accent'}
                size="md"
                leftIcon={<ThumbsUp className={`w-4 h-4 ${problem.hasUpvoted ? 'fill-teal-700 text-teal-700' : ''}`} />}
                onClick={() => onUpvoteProblem(problem.id)}
              >
                {problem.hasUpvoted ? 'Upvoted ✓' : 'Support Issue'} ({problem.upvotes})
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header: Proposals | Discussion | Progress */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('proposals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'proposals'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <span>Solution Proposals ({proposals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discussion')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'discussion'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community Discussion ({comments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'progress'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>On-Ground Progress ({progressUpdates.length})</span>
          </button>
        </div>

        {/* Dynamic Contextual Action based on active tab */}
        {activeTab === 'proposals' && (
          <PrimaryButton
            variant="accent"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenProposeModal}
          >
            Propose a Solution
          </PrimaryButton>
        )}
        {activeTab === 'progress' && (
          <PrimaryButton
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenProgressModal}
          >
            Post Ground Update
          </PrimaryButton>
        )}
      </div>

      {/* TAB 1: PROPOSALS */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <EmptyState
              title="No Solutions Proposed Yet"
              description="Be the first engineer, researcher, or citizen to propose a viable solution approach."
              hindiDescription="अभी कोई समाधान प्रस्तावित नहीं हुआ है। पहला समाधान प्रस्तुत करें!"
              icon={Lightbulb}
              actionLabel="Submit Solution Proposal"
              onAction={onOpenProposeModal}
            />
          ) : (
            <div className="space-y-4">
              {proposals.map((prop) => (
                <ProposalCard
                  key={prop.id}
                  proposal={prop}
                  currentUserTier={currentUser.tier}
                  currentUserId={currentUser.id}
                  onUpvoteProposal={onUpvoteProposal}
                  onCastQuorumVote={onCastQuorumVote}
                  onApproveAsExpert={onApproveAsExpert}
                  onClaimProposal={onClaimProposal}
                  onRequestUpgradeToLocal={onRequestUpgradeToLocal}
                  onRequestUpgradeToExpert={onRequestUpgradeToExpert}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DISCUSSION */}
      {activeTab === 'discussion' && (
        <div className="space-y-4">
          {/* New comment input form */}
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-bold text-slate-800">
                Join Discussion as {currentUser.name}
              </span>
              <TierBadge tier={currentUser.tier} size="sm" />
            </div>

            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share ground updates, historical context, or ask questions to local authorities..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
            />

            <div className="flex justify-end">
              <PrimaryButton
                type="submit"
                variant="primary"
                size="sm"
                rightIcon={<Send className="w-3.5 h-3.5" />}
                disabled={!commentText.trim()}
              >
                Post Comment
              </PrimaryButton>
            </div>
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <EmptyState
              title="No Comments Yet"
              description="Start the community conversation to clarify facts and discuss next steps."
              icon={MessageSquare}
            />
          ) : (
            <div className="space-y-3">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comm.author.avatar}
                        alt={comm.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {comm.author.name}
                          </span>
                          <TierBadge tier={comm.author.tier} size="sm" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {comm.author.district} • {new Date(comm.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpvoteComment(comm.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                        comm.hasUpvoted
                          ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${comm.hasUpvoted ? 'fill-teal-700' : ''}`} />
                      <span>{comm.upvotes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10 font-hindi">
                    {comm.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ON-GROUND PROGRESS TIMELINE */}
      {activeTab === 'progress' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between text-xs text-teal-900">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Public Verification Ledger: Every progress stage requires geo-tagged photo proof.
            </span>
            <span className="font-mono text-[11px] text-teal-700 font-bold">
              {progressUpdates.length} Updates Logged
            </span>
          </div>

          {progressUpdates.length === 0 ? (
            <EmptyState
              title="No Ground Updates Logged Yet"
              description="Once a proposal is claimed or ground execution begins, field officers & local monitors will post timestamped photo proof here."
              hindiDescription="कार्य प्रगति का फ़ोटो प्रमाण यहाँ दिखेगा।"
              icon={Wrench}
              actionLabel="Post First Field Update"
              onAction={onOpenProgressModal}
            />
          ) : (
            <div className="space-y-1">
              {progressUpdates.map((update, idx) => (
                <ProgressTimelineItem
                  key={update.id}
                  update={update}
                  isLast={idx === progressUpdates.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
