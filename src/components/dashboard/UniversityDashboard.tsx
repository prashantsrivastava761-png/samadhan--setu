import React, { useState } from 'react';
import { Problem, Proposal, User, ImplementerType } from '../../types';
import { DomainTag } from '../common/DomainTag';
import { StatusPill } from '../common/StatusPill';
import { PrimaryButton } from '../common/PrimaryButton';
import { VerifiedBadge } from '../common/VerifiedBadge';
import {
  Building2,
  CheckCircle2,
  Clock,
  IndianRupee,
  Users,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  FolderKanban,
  FileText,
  BarChart3,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

interface UniversityDashboardProps {
  problems: Problem[];
  proposals: Proposal[];
  currentUser: User;
  onSelectProblem: (problem: Problem) => void;
  onClaimProposal: (proposalId: string) => void;
  onOpenProposeModal: (problemId: string) => void;
}

type KanbanColumn = 'verified' | 'claimed' | 'in_progress' | 'piloted' | 'resolved';

const KANBAN_STAGES: Array<{ id: KanbanColumn; title: string; subtitle: string; color: string; border: string }> = [
  { id: 'verified', title: '1. Verified (Ready to Claim)', subtitle: 'Quorum or Expert Certified', color: 'bg-emerald-50 text-emerald-900', border: 'border-emerald-300' },
  { id: 'claimed', title: '2. Claimed', subtitle: 'Institutional NOC Granted', color: 'bg-blue-50 text-blue-900', border: 'border-blue-300' },
  { id: 'in_progress', title: '3. In Progress', subtitle: 'Ground Deployment', color: 'bg-cyan-50 text-cyan-900', border: 'border-cyan-300' },
  { id: 'piloted', title: '4. Piloted', subtitle: 'Field Calibration', color: 'bg-purple-50 text-purple-900', border: 'border-purple-300' },
  { id: 'resolved', title: '5. Resolved & Handed Over', subtitle: 'Panchayat Sign-off', color: 'bg-teal-50 text-teal-900', border: 'border-teal-300' }
];

export const UniversityDashboard: React.FC<UniversityDashboardProps> = ({
  problems,
  proposals,
  currentUser,
  onSelectProblem,
  onClaimProposal,
  onOpenProposeModal
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'kanban' | 'assigned' | 'team' | 'reports'>('kanban');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  // Group proposals into Kanban buckets
  const kanbanData: Record<KanbanColumn, Proposal[]> = {
    verified: proposals.filter((p) => (p.status === 'open' || p.status === 'verified') && (p.expertApproved || p.quorumVotes >= p.requiredQuorum)),
    claimed: proposals.filter((p) => p.status === 'claimed'),
    in_progress: proposals.filter((p) => p.status === 'in_progress'),
    piloted: proposals.filter((p) => p.status === 'piloted'),
    resolved: proposals.filter((p) => p.status === 'resolved')
  };

  const getProblemForProposal = (problemId: string) => {
    return problems.find((p) => p.id === problemId);
  };

  return (
    <div id="university-dashboard" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-20 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            University & Institutional Implementer Console
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            IIT (ISM) & BAU Rural Technology Deployment
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
            Adopt citizen-verified civic proposals, commit engineering CSR / grant resources, and track milestone-level field execution across Jharkhand.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-right">
            <span className="text-[11px] text-blue-200 block">Logged in as</span>
            <strong className="text-xs font-bold text-white block">
              {currentUser.expertOrg || currentUser.name}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Kanban Board */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Dashboard Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-3">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveSidebarTab('kanban')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSidebarTab === 'kanban'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span>Kanban Pipeline</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-800 text-blue-100">
                {proposals.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('assigned')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSidebarTab === 'assigned'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>My Claimed Projects</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-800 text-blue-100">
                {kanbanData.claimed.length + kanbanData.in_progress.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('team')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSidebarTab === 'team'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Research Field Team</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">8 Units</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSidebarTab === 'reports'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Fund Grant Reports</span>
              </span>
            </button>
          </div>

          {/* Quick Metrics Card */}
          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 text-xs space-y-2">
            <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              Impact KPI Summary
            </h4>
            <div className="space-y-1 text-slate-700 text-[11px]">
              <div className="flex justify-between">
                <span>Verified Proposals:</span>
                <strong className="text-slate-900">{kanbanData.verified.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Active University Pilots:</span>
                <strong className="text-slate-900">{kanbanData.in_progress.length + kanbanData.piloted.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Completed Resolutions:</span>
                <strong className="text-emerald-700 font-bold">{kanbanData.resolved.length}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Board Area */}
        <div className="flex-1 min-w-0 space-y-4">
          {activeSidebarTab === 'kanban' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-blue-700" />
                  Proposal Execution Lifecycle (Kanban)
                </h3>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Scroll horizontally to view all stages →
                </span>
              </div>

              {/* Responsive Kanban Columns */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {KANBAN_STAGES.map((col) => {
                  const items = kanbanData[col.id] || [];
                  return (
                    <div
                      key={col.id}
                      className="w-72 sm:w-80 shrink-0 bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col max-h-[680px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">{col.title}</h4>
                          <p className="text-[10px] text-slate-500">{col.subtitle}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 shadow-2xs">
                          {items.length}
                        </span>
                      </div>

                      {/* Column Cards List */}
                      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                        {items.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs bg-white/60 rounded-xl border border-dashed border-slate-300">
                            No proposals in this stage
                          </div>
                        ) : (
                          items.map((prop) => {
                            const parentProblem = getProblemForProposal(prop.problemId);
                            return (
                              <div
                                key={prop.id}
                                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-2.5 group"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  {parentProblem && <DomainTag domain={parentProblem.domain} size="sm" />}
                                  {prop.expertApproved ? (
                                    <VerifiedBadge type="expert" />
                                  ) : (
                                    <VerifiedBadge type="quorum" votesCount={prop.quorumVotes} />
                                  )}
                                </div>

                                <h5
                                  onClick={() => parentProblem && onSelectProblem(parentProblem)}
                                  className="text-xs font-bold text-slate-900 group-hover:text-blue-900 cursor-pointer line-clamp-2 leading-snug"
                                >
                                  {prop.title}
                                </h5>

                                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                  {prop.approachSummary}
                                </p>

                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                                  <span className="text-slate-600 font-medium">Budget: {prop.estimatedCost}</span>
                                  <span className="text-slate-500 font-medium">{prop.estimatedTimeframe}</span>
                                </div>

                                {parentProblem && (
                                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                                    <span>📍 {parentProblem.block}, {parentProblem.district}</span>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                  {col.id === 'verified' && (
                                    <PrimaryButton
                                      variant="primary"
                                      size="sm"
                                      className="w-full text-xs"
                                      leftIcon={<Building2 className="w-3.5 h-3.5" />}
                                      onClick={() => onClaimProposal(prop.id)}
                                    >
                                      Claim this Proposal
                                    </PrimaryButton>
                                  )}

                                  {col.id !== 'verified' && parentProblem && (
                                    <button
                                      type="button"
                                      onClick={() => onSelectProblem(parentProblem)}
                                      className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 w-full justify-center py-1 bg-slate-50 rounded-lg hover:bg-slate-100"
                                    >
                                      <span>View Live Updates</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSidebarTab === 'assigned' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Institutional Active Projects ({kanbanData.claimed.length + kanbanData.in_progress.length})
              </h3>
              <div className="space-y-3">
                {[...kanbanData.claimed, ...kanbanData.in_progress].map((prop) => {
                  const prob = getProblemForProposal(prop.problemId);
                  return (
                    <div
                      key={prop.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {prob && <DomainTag domain={prob.domain} size="sm" />}
                          <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                            Status: {prop.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{prop.title}</h4>
                        <p className="text-xs text-slate-500">
                          Location: {prob?.block}, {prob?.district} • Budget: {prop.estimatedCost}
                        </p>
                      </div>

                      {prob && (
                        <PrimaryButton
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectProblem(prob)}
                        >
                          Open Project Ledger
                        </PrimaryButton>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSidebarTab === 'team' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Rural Innovation & Field Units (Jharkhand Campuses)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'IIT (ISM) Dhanbad - Water Tech Cell', lead: 'Prof. S. K. Gupta', projects: 4, phone: '+91 326 2235001' },
                  { name: 'Birsa Agricultural University - Post Harvest Lab', lead: 'Dr. Alok Soren', projects: 3, phone: '+91 651 2450821' },
                  { name: 'BIT Mesra - Renewable Solar Unit', lead: 'Dr. P. K. Srivastava', projects: 2, phone: '+91 651 2275444' },
                  { name: 'RIMS Ranchi - Public Health Field Division', lead: 'Dr. Vivek Sinha', projects: 3, phone: '+91 651 2541533' }
                ].map((unit, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{unit.name}</h4>
                    <p className="text-[11px] text-slate-600 font-medium">Lead: {unit.lead}</p>
                    <p className="text-[11px] text-slate-500">Active Field Missions: {unit.projects}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSidebarTab === 'reports' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 text-xs">
              <h3 className="text-base font-bold text-slate-900">Grant Utilization & Impact Reports</h3>
              <p className="text-slate-600">
                Download quarterly public audit documentation and fund utilization certificates for Jharkhand State Planning Dept.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  'Q2-2026_Water_Filtration_Tamar_GramSabha_Handover.pdf (2.4 MB)',
                  'Solar_Cold_Storage_Ormanjhi_Farmer_Income_Audit.pdf (1.8 MB)',
                  'Chandil_Bridge_Subarnarekha_JSRDC_Completion_Certificate.pdf (3.1 MB)'
                ].map((file, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">📄 {file}</span>
                    <button className="text-blue-700 font-bold hover:underline">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
