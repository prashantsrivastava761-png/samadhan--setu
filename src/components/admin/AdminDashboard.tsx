import React, { useState, useEffect } from 'react';
import { User, Proposal, Problem } from '../../types';
import {
  AdminAction,
  ExpertApplication,
  FlaggedVerification,
  UnclaimedProposalAlert,
  EscalationDepartment
} from '../../types/admin';
import { SupabaseAdminService, JHARKHAND_DEPARTMENTS } from '../../services/supabaseAdmin';
import { PendingExpertApplications } from './PendingExpertApplications';
import { FlaggedVerificationsList } from './FlaggedVerificationsList';
import { VerificationOverviewTable } from './VerificationOverviewTable';
import { UnclaimedProposalsSection } from './UnclaimedProposalsSection';
import { AdminAuditLogViewer } from './AdminAuditLogViewer';
import { SqlMigrationViewer } from './SqlMigrationViewer';
import { AdminConfirmationModal, AdminConfirmationConfig } from './AdminConfirmationModal';
import {
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  AlertTriangle,
  FileSpreadsheet,
  Send,
  History,
  Database,
  Lock,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  proposals: Proposal[];
  problems: Problem[];
  onUpdateProposalStatus?: (proposalId: string, status: any) => void;
  onNavigateToProblem?: (problemId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  proposals: initialProposals,
  problems,
  onUpdateProposalStatus,
  onNavigateToProblem
}) => {
  const [activeTab, setActiveTab] = useState<
    'expert_apps' | 'flagged' | 'overview' | 'unclaimed' | 'audit_log' | 'sql_migration'
  >('expert_apps');

  // State loaded from Supabase / Local Storage service
  const [expertApps, setExpertApps] = useState<ExpertApplication[]>([]);
  const [flags, setFlags] = useState<FlaggedVerification[]>([]);
  const [unclaimedAlerts, setUnclaimedAlerts] = useState<UnclaimedProposalAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAction[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Confirmation Modal State
  const [modalConfig, setModalConfig] = useState<AdminConfirmationConfig>({
    isOpen: false,
    title: '',
    actionName: '',
    actionType: 'info',
    targetTitle: '',
    onConfirm: () => {},
    onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
  });

  const loadData = () => {
    setExpertApps(SupabaseAdminService.getExpertApplications());
    setFlags(SupabaseAdminService.getFlaggedVerifications());
    setUnclaimedAlerts(SupabaseAdminService.getUnclaimedAlerts());
    setAuditLogs(SupabaseAdminService.getAdminActions());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const adminIdentity = {
    id: currentUser.id || 'usr_admin_01',
    name: currentUser.name || 'Platform Administrator',
    email: 'admin.samadhansetu@jharkhand.gov.in'
  };

  // 1. Trigger Approve Expert Modal
  const handleTriggerApproveExpert = (app: ExpertApplication) => {
    setModalConfig({
      isOpen: true,
      title: 'Approve Tier 3 Expert Status',
      actionName: 'Approve Faculty Credentials',
      actionType: 'success',
      targetTitle: `${app.fullName} (${app.designation})`,
      targetSubtitle: `${app.institution} • Domain: ${app.domain.toUpperCase()}`,
      warningNote: 'Promoting this user will grant them unilateral fast-track verification authority and technical veto power over civic proposals in their domain.',
      defaultJustification: `Verified credentials with ${app.institution} institutional records. Publications and technical background verified.`,
      onConfirm: async (justification) => {
        const result = await SupabaseAdminService.reviewExpertApplication(
          adminIdentity,
          app.id,
          'approved',
          justification
        );
        loadData();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Approved Tier 3 Expert status for ${app.fullName}. Audit log entry recorded.`);
      },
      onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // 2. Trigger Reject Expert Modal
  const handleTriggerRejectExpert = (app: ExpertApplication) => {
    setModalConfig({
      isOpen: true,
      title: 'Reject Tier 3 Expert Application',
      actionName: 'Reject Credentials Application',
      actionType: 'danger',
      targetTitle: `${app.fullName} (${app.designation})`,
      targetSubtitle: `${app.institution} • Domain: ${app.domain.toUpperCase()}`,
      warningNote: 'Applicant will remain at their current Tier. A formal reason will be sent to the applicant and recorded in the audit trail.',
      defaultJustification: 'Insufficient institutional affiliation documentation or unverifiable faculty registry record.',
      onConfirm: async (justification) => {
        await SupabaseAdminService.reviewExpertApplication(
          adminIdentity,
          app.id,
          'rejected',
          justification,
          justification
        );
        loadData();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Rejected Tier 3 application for ${app.fullName}. Reason logged.`);
      },
      onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // 3. Trigger Override Flag Modal
  const handleTriggerOverrideFlag = (flag: FlaggedVerification) => {
    setModalConfig({
      isOpen: true,
      title: 'Override Verification Flag',
      actionName: 'Override Sybil Alert & Pass',
      actionType: 'warning',
      targetTitle: flag.proposalTitle,
      targetSubtitle: `Flag: ${flag.flagReason} (${flag.district})`,
      warningNote: 'Overriding will clear the alert and advance the proposal to Verified status despite the automated anomaly signal.',
      defaultJustification: 'Field investigation verified on-ground legitimacy: voters gathered at Gram Panchayat Bhawan shared WiFi router explaining identical IP subnet.',
      onConfirm: async (justification) => {
        await SupabaseAdminService.resolveFlaggedVerification(
          adminIdentity,
          flag.id,
          'overridden',
          justification
        );
        // Also update proposal status in local proposals state
        setProposals((prev) =>
          prev.map((p) => (p.id === flag.proposalId ? { ...p, status: 'verified' } : p))
        );
        if (onUpdateProposalStatus) {
          onUpdateProposalStatus(flag.proposalId, 'verified');
        }
        loadData();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Flag overridden for proposal ${flag.proposalId}. Status upgraded to Verified.`);
      },
      onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // 4. Trigger Dismiss Flag Modal
  const handleTriggerDismissFlag = (flag: FlaggedVerification) => {
    setModalConfig({
      isOpen: true,
      title: 'Dismiss Verification Flag',
      actionName: 'Dismiss Flag as False Alarm',
      actionType: 'info',
      targetTitle: flag.proposalTitle,
      targetSubtitle: `Reason: ${flag.flagReason}`,
      warningNote: 'Dismissing marks the flag as resolved without overriding the normal quorum requirements.',
      defaultJustification: 'False positive: Voter GPS accuracy radius variance within acceptable rural boundary limits.',
      onConfirm: async (justification) => {
        await SupabaseAdminService.resolveFlaggedVerification(
          adminIdentity,
          flag.id,
          'dismissed',
          justification
        );
        loadData();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Flag dismissed. Audit trail updated.`);
      },
      onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // 5. Trigger Force Verify Proposal Modal
  const handleTriggerForceVerify = (proposal: Proposal, problemTitle: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Administrative Force Verify Proposal',
      actionName: 'Force Verify Proposal',
      actionType: 'warning',
      targetTitle: proposal.title,
      targetSubtitle: `Problem: ${problemTitle} • Current Quorum: ${proposal.quorumVotes}/${proposal.requiredQuorum}`,
      warningNote: 'Force verifying bypasses any remaining Tier 2 citizen quorum or Tier 3 expert approval. This action will be prominently logged.',
      defaultJustification: 'Urgent public grievance intervention by District Magistrate special directive or disaster relief protocol.',
      onConfirm: async (justification) => {
        await SupabaseAdminService.logAdminAction(
          adminIdentity,
          'force_verify_proposal',
          proposal.id,
          'proposal',
          justification,
          {
            previousStatus: proposal.status,
            previousQuorumVotes: proposal.quorumVotes,
            proposalTitle: proposal.title,
            cost: proposal.estimatedCost
          }
        );

        setProposals((prev) =>
          prev.map((p) => (p.id === proposal.id ? { ...p, status: 'verified', quorumVotes: 5, expertApproved: true } : p))
        );
        if (onUpdateProposalStatus) {
          onUpdateProposalStatus(proposal.id, 'verified');
        }
        loadData();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Proposal "${proposal.title.substring(0, 30)}..." marked as Verified.`);
      },
      onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // 6. Trigger Force Reject Proposal Modal
  const handleTriggerForceReject = (proposal: Proposal, problemTitle: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Disqualify / Reject Civic Proposal',
      actionName: 'Force Reject Proposal',
      actionType: 'danger',
      targetTitle: proposal.title,
      targetSubtitle: `Proposed by: ${proposal.proposedBy.name} • Cost: ${proposal.estimatedCost}`,
      warningNote: 'Disqualifying this proposal removes it from active community voting and prevents university adoption. Reason will be recorded in the audit log.',
      defaultJustification: 'Violates environmental safety guidelines, duplicate of an ongoing government sanction, or economically unfeasible.',
      onConfirm: async (justification) => {
        await SupabaseAdminService.logAdminAction(
          adminIdentity,
          'force_reject_proposal',
          proposal.id,
          'proposal',
          justification,
          {
            previousStatus: proposal.status,
            proposalTitle: proposal.title,
            reason: justification
          }
        );
        loadData();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Proposal disqualified and logged to audit table.`);
      },
      onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // 7. Trigger Escalate Unclaimed Proposal Modal
  const handleTriggerEscalate = (alert: UnclaimedProposalAlert, department: EscalationDepartment) => {
    setModalConfig({
      isOpen: true,
      title: 'Formal Department Escalation',
      actionName: `Escalate to ${department.name.substring(0, 24)}...`,
      actionType: 'warning',
      targetTitle: alert.title,
      targetSubtitle: `Target: ${department.name} • Nodal Officer: ${department.nodalOfficer}`,
      warningNote: `Dispatches official notification memo to ${department.contactEmail} and flags this civic issue for direct departmental tender/budget allocation.`,
      defaultJustification: `Verified solution has exceeded the 14-day university adoption SLA with zero claims. Escalated for state budget sanction under FY26-27 District Mineral Foundation Trust (DMFT) fund.`,
      onConfirm: async (justification) => {
        await SupabaseAdminService.escalateUnclaimedProposal(
          adminIdentity,
          alert.proposalId,
          department.id,
          department.name,
          justification
        );
        loadData();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Escalated to ${department.name}. Formal tracking notice logged.`);
      },
      onCancel: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  const pendingAppsCount = expertApps.filter((a) => a.status === 'pending').length;
  const pendingFlagsCount = flags.filter((f) => f.status === 'pending').length;
  const pendingEscalationsCount = unclaimedAlerts.filter((a) => a.escalationStatus === 'not_escalated').length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Role Identity Bar & Security Badge */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/40">
                <Lock className="w-3.5 h-3.5" />
                SUPER ADMIN OVERSIGHT
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                RLS: users.is_admin = TRUE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Platform Verification Moderation Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Oversee Tier 3 expert credential applications, review automated Sybil detection anomalies, inspect proposal verification quorums, and manually escalate stalled solutions to Jharkhand State departments.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center text-amber-400 font-bold border border-teal-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{adminIdentity.name}</p>
              <p className="text-[11px] font-mono text-slate-400">{adminIdentity.email}</p>
              <span className="text-[10px] text-teal-400 font-semibold block mt-0.5">
                Full Immutable Audit Logging Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Pending Expert Apps */}
        <div
          onClick={() => setActiveTab('expert_apps')}
          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all shadow-2xs ${
            activeTab === 'expert_apps'
              ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pending Expert Apps
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{pendingAppsCount}</span>
            <span className="text-xs font-bold text-amber-700">Tier 3 Requests</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Institutional email & ID check</p>
        </div>

        {/* Metric 2: Flagged Sybil Verifications */}
        <div
          onClick={() => setActiveTab('flagged')}
          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all shadow-2xs ${
            activeTab === 'flagged'
              ? 'bg-rose-500/10 border-rose-400 ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Flags
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center border border-rose-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{pendingFlagsCount}</span>
            <span className="text-xs font-bold text-rose-700">Abuse Alerts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">IP bursts & geo discrepancies</p>
        </div>

        {/* Metric 3: Stalled Unclaimed Proposals */}
        <div
          onClick={() => setActiveTab('unclaimed')}
          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all shadow-2xs ${
            activeTab === 'unclaimed'
              ? 'bg-purple-500/10 border-purple-400 ring-2 ring-purple-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              SLA Escalations
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-200">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{pendingEscalationsCount}</span>
            <span className="text-xs font-bold text-purple-700">&gt;14 Days Stalled</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Direct State Dept escalations</p>
        </div>

        {/* Metric 4: Audit Actions Logged */}
        <div
          onClick={() => setActiveTab('audit_log')}
          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all shadow-2xs ${
            activeTab === 'audit_log'
              ? 'bg-teal-500/10 border-teal-400 ring-2 ring-teal-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Audit Actions
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center border border-teal-200">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{auditLogs.length}</span>
            <span className="text-xs font-bold text-teal-700">Logged Events</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero silent admin actions</p>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('expert_apps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'expert_apps'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>1. Pending Expert Applications</span>
          {pendingAppsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center">
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flagged')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'flagged'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>2. Flagged Verifications</span>
          {pendingFlagsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
              {pendingFlagsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>3. Verification Overview Table</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unclaimed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'unclaimed'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>4. Unclaimed Escalations</span>
          {pendingEscalationsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-black flex items-center justify-center">
              {pendingEscalationsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit_log')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'audit_log'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>5. Admin Audit Log</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sql_migration')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'sql_migration'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>6. Supabase SQL &amp; RLS</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <div>
        {activeTab === 'expert_apps' && (
          <PendingExpertApplications
            applications={expertApps}
            onApprove={handleTriggerApproveExpert}
            onReject={handleTriggerRejectExpert}
          />
        )}

        {activeTab === 'flagged' && (
          <FlaggedVerificationsList
            flags={flags}
            onOverride={handleTriggerOverrideFlag}
            onDismiss={handleTriggerDismissFlag}
            onInspectProposal={onNavigateToProblem}
          />
        )}

        {activeTab === 'overview' && (
          <VerificationOverviewTable
            proposals={proposals}
            problems={problems}
            onForceVerify={handleTriggerForceVerify}
            onForceReject={handleTriggerForceReject}
            onSelectProblem={onNavigateToProblem}
          />
        )}

        {activeTab === 'unclaimed' && (
          <UnclaimedProposalsSection
            alerts={unclaimedAlerts}
            onEscalate={handleTriggerEscalate}
          />
        )}

        {activeTab === 'audit_log' && (
          <AdminAuditLogViewer logs={auditLogs} />
        )}

        {activeTab === 'sql_migration' && (
          <SqlMigrationViewer />
        )}
      </div>

      {/* Reusable Confirmation Modal with Mandatory Justification Enforcement */}
      <AdminConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        actionName={modalConfig.actionName}
        actionType={modalConfig.actionType}
        targetTitle={modalConfig.targetTitle}
        targetSubtitle={modalConfig.targetSubtitle}
        warningNote={modalConfig.warningNote}
        defaultJustification={modalConfig.defaultJustification}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />
    </div>
  );
};
