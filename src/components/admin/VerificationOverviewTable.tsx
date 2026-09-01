import React, { useState } from 'react';
import { Proposal, Problem } from '../../types';
import { PrimaryButton } from '../common/PrimaryButton';
import {
  ShieldCheck,
  ShieldX,
  CheckCircle2,
  XCircle,
  Users,
  Award,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface VerificationOverviewTableProps {
  proposals: Proposal[];
  problems: Problem[];
  onForceVerify: (proposal: Proposal, problemTitle: string) => void;
  onForceReject: (proposal: Proposal, problemTitle: string) => void;
  onSelectProblem?: (problemId: string) => void;
}

export const VerificationOverviewTable: React.FC<VerificationOverviewTableProps> = ({
  proposals,
  problems,
  onForceVerify,
  onForceReject,
  onSelectProblem
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [implementerFilter, setImplementerFilter] = useState<string>('all');

  const problemMap = new Map<string, Problem>();
  problems.forEach((p) => problemMap.set(p.id, p));

  const filteredProposals = proposals.filter((prop) => {
    const parentProblem = problemMap.get(prop.problemId);
    if (statusFilter !== 'all') {
      if (statusFilter === 'verified' && prop.status !== 'verified' && !prop.expertApproved && prop.quorumVotes < prop.requiredQuorum) {
        return false;
      }
      if (statusFilter === 'pending' && (prop.status === 'verified' || prop.status === 'claimed' || prop.status === 'resolved')) {
        return false;
      }
    }
    if (implementerFilter !== 'all' && prop.implementerType !== implementerFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const problemTitle = parentProblem ? parentProblem.title.toLowerCase() : '';
      return (
        prop.title.toLowerCase().includes(q) ||
        prop.approachSummary.toLowerCase().includes(q) ||
        prop.proposedBy.name.toLowerCase().includes(q) ||
        problemTitle.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Platform Verification & Moderation Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time quorum votes, technical expert signatures, and exercise manual administrative oversight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
          >
            <option value="all">All Statuses ({proposals.length})</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified / Active</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search proposal or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Proposals Verification Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Proposal Title & Target Problem</th>
                <th className="px-4 py-3">Author & Implementer</th>
                <th className="px-4 py-3">Quorum Status (Tier 2)</th>
                <th className="px-4 py-3">Expert Approval (Tier 3)</th>
                <th className="px-4 py-3">Lifecycle State</th>
                <th className="px-4 py-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No proposals matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProposals.map((prop) => {
                  const parentProblem = problemMap.get(prop.problemId);
                  const isFullyVerified =
                    prop.status === 'verified' ||
                    prop.status === 'claimed' ||
                    prop.status === 'in_progress' ||
                    prop.status === 'resolved' ||
                    prop.expertApproved ||
                    prop.quorumVotes >= prop.requiredQuorum;

                  const quorumPercent = Math.min(
                    100,
                    Math.round((prop.quorumVotes / prop.requiredQuorum) * 100)
                  );

                  return (
                    <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Proposal & Problem Title */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 line-clamp-2 leading-snug">
                            {prop.title}
                          </p>
                          {parentProblem && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                              <span className="font-semibold text-slate-600">Problem:</span> {parentProblem.title}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>Cost: {prop.estimatedCost}</span>
                            <span>•</span>
                            <span>Time: {prop.estimatedTimeframe}</span>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={prop.proposedBy.avatar}
                            alt={prop.proposedBy.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-300"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">
                              {prop.proposedBy.name}
                            </p>
                            <span className="text-[10px] text-slate-400 capitalize">
                              {prop.implementerType.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Quorum Votes */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="space-y-1 w-32">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="flex items-center gap-1 text-slate-700">
                              <Users className="w-3 h-3 text-teal-700" />
                              {prop.quorumVotes}/{prop.requiredQuorum}
                            </span>
                            <span className={quorumPercent >= 100 ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              {quorumPercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                quorumPercent >= 100 ? 'bg-emerald-600' : 'bg-teal-700'
                              }`}
                              style={{ width: `${quorumPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {prop.quorumVotes >= prop.requiredQuorum ? 'Quorum Met' : 'Needs local voters'}
                          </span>
                        </div>
                      </td>

                      {/* Expert Approval */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {prop.expertApproved ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-700" /> Expert Verified
                            </span>
                            {prop.expertApprover && (
                              <p className="text-[10px] text-slate-500 max-w-[140px] truncate">
                                by {prop.expertApprover.name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            <Clock className="w-3 h-3 text-slate-400" /> Pending Review
                          </span>
                        )}
                      </td>

                      {/* State */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                          prop.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                            : prop.status === 'claimed' || prop.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-900 border-blue-200'
                            : isFullyVerified
                            ? 'bg-teal-100 text-teal-900 border-teal-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {prop.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isFullyVerified && (
                            <button
                              type="button"
                              onClick={() => onForceVerify(prop, parentProblem?.title || '')}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-800 text-white hover:bg-teal-900 transition-colors shadow-2xs"
                              title="Force verify proposal with mandatory justification"
                            >
                              Force Verify
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onForceReject(prop, parentProblem?.title || '')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                            title="Force reject / disqualify proposal with justification"
                          >
                            Disqualify
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
