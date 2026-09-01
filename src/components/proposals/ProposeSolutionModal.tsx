import React, { useState } from 'react';
import { Proposal, ImplementerType, User } from '../../types';
import { PrimaryButton } from '../common/PrimaryButton';
import { Lightbulb, IndianRupee, Clock, Building2, Plus, Trash2, X, Sparkles } from 'lucide-react';

interface ProposeSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problemTitle: string;
  currentUser: User;
  onSubmitProposal: (proposalData: Partial<Proposal>) => void;
}

export const ProposeSolutionModal: React.FC<ProposeSolutionModalProps> = ({
  isOpen,
  onClose,
  problemId,
  problemTitle,
  currentUser,
  onSubmitProposal
}) => {
  const [title, setTitle] = useState<string>('');
  const [approachSummary, setApproachSummary] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<string>('₹2,50,000');
  const [estimatedTimeframe, setEstimatedTimeframe] = useState<string>('6 Weeks');
  const [implementerType, setImplementerType] = useState<ImplementerType>('university');
  const [milestones, setMilestones] = useState<string[]>([
    'Site feasibility & water/soil quality audit',
    'Local Gram Panchayat clearance',
    'Procurement & assembly of filtration components'
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState<string>('');

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (newMilestoneText.trim()) {
      setMilestones([...milestones, newMilestoneText.trim()]);
      setNewMilestoneText('');
    }
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !approachSummary.trim()) {
      alert('Please fill out the proposal title and approach summary.');
      return;
    }

    onSubmitProposal({
      problemId,
      title,
      approachSummary,
      estimatedCost,
      estimatedTimeframe,
      implementerType,
      proposedBy: {
        id: currentUser.id,
        name: currentUser.name,
        tier: currentUser.tier,
        avatar: currentUser.avatar,
        affiliation: currentUser.expertOrg || `${currentUser.district} Civic Contributor`
      },
      proposedAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
      quorumVotes: currentUser.tier === 'local_verified' ? 1 : 0,
      requiredQuorum: 5,
      quorumVoters: currentUser.tier === 'local_verified' ? [currentUser.id] : [],
      expertApproved: currentUser.tier === 'expert',
      expertApprover:
        currentUser.tier === 'expert'
          ? {
              name: currentUser.name,
              title: 'Credentialed Expert',
              domain: currentUser.expertDomain || 'water',
              organization: currentUser.expertOrg || 'Birsa Agricultural University',
              justification: 'Initial technical feasibility endorsement upon proposal submission.',
              approvedAt: new Date().toISOString()
            }
          : undefined,
      status: 'open',
      keyMilestones: milestones
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Propose a Technical / Practical Solution
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              For issue: {problemTitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Solution Title (समाधान का शीर्षक) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solar-powered dual-stage adsorption filtration system"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Technical / Operational Approach Summary (विस्तृत कार्यप्रणाली) *
            </label>
            <textarea
              rows={3}
              value={approachSummary}
              onChange={(e) => setApproachSummary(e.target.value)}
              placeholder="Describe the engineering design, materials required, sustainability model, and maintenance plan..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Budget (अनुमानित लागत)
              </label>
              <input
                type="text"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="₹3,50,000"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Timeframe (समय सीमा)
              </label>
              <input
                type="text"
                value={estimatedTimeframe}
                onChange={(e) => setEstimatedTimeframe(e.target.value)}
                placeholder="6 Weeks"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ideal Implementer
              </label>
              <select
                value={implementerType}
                onChange={(e) => setImplementerType(e.target.value as ImplementerType)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="university">University / Research</option>
                <option value="government">Government Dept</option>
                <option value="industry_ngo">Industry / CSR / NGO</option>
              </select>
            </div>
          </div>

          {/* Key Milestones */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Key Implementation Milestones ({milestones.length})
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="text-slate-800 font-medium line-clamp-1">
                    {idx + 1}. {m}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                placeholder="Add milestone step (e.g. Village Jal Samiti training)..."
                className="flex-1 text-xs p-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
              />
              <PrimaryButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddMilestone}
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </PrimaryButton>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900">
            Once submitted, your proposal will enter the Community Quorum queue. 5 verified residents or 1 certified expert can approve it for government & university adoption.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <PrimaryButton type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </PrimaryButton>
            <PrimaryButton
              type="submit"
              variant="accent"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Submit Solution Proposal
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
