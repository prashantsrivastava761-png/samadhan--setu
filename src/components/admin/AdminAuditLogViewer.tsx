import React, { useState } from 'react';
import { AdminAction } from '../../types/admin';
import {
  FileText,
  Search,
  Download,
  ShieldCheck,
  Lock,
  Calendar,
  User,
  Filter,
  Code,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';

interface AdminAuditLogViewerProps {
  logs: AdminAction[];
}

export const AdminAuditLogViewer: React.FC<AdminAuditLogViewerProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [selectedMetadata, setSelectedMetadata] = useState<{ id: string; data: any } | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (actionTypeFilter !== 'all' && log.actionType !== actionTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.adminName.toLowerCase().includes(q) ||
        log.justification.toLowerCase().includes(q) ||
        log.actionType.toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'approve_expert_application':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
            APPROVE EXPERT
          </span>
        );
      case 'reject_expert_application':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
            REJECT EXPERT
          </span>
        );
      case 'override_flagged_verification':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
            OVERRIDE FLAG
          </span>
        );
      case 'dismiss_flagged_verification':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
            DISMISS FLAG
          </span>
        );
      case 'force_verify_proposal':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
            FORCE VERIFY
          </span>
        );
      case 'force_reject_proposal':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200">
            FORCE REJECT
          </span>
        );
      case 'escalate_unclaimed_proposal':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
            DEPT ESCALATE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
            {type.toUpperCase()}
          </span>
        );
    }
  };

  const exportLogsCsv = () => {
    const headers = ['Action ID', 'Timestamp', 'Admin Name', 'Admin Email', 'Action Type', 'Target Type', 'Target ID', 'Justification'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${new Date(l.createdAt).toISOString()}"`,
      `"${l.adminName.replace(/"/g, '""')}"`,
      `"${l.adminEmail}"`,
      `"${l.actionType}"`,
      `"${l.targetType}"`,
      `"${l.targetId}"`,
      `"${l.justification.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samadhan_setu_admin_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-700" />
              Immutable Regulatory Audit Trail
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {logs.length} Total Logged Actions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Every administrative decision, verification override, and tier change is strictly recorded with mandatory justification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action Type Filter */}
          <select
            value={actionTypeFilter}
            onChange={(e) => setActionTypeFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
          >
            <option value="all">All Action Types</option>
            <option value="approve_expert_application">Approve Expert</option>
            <option value="reject_expert_application">Reject Expert</option>
            <option value="override_flagged_verification">Override Flag</option>
            <option value="dismiss_flagged_verification">Dismiss Flag</option>
            <option value="force_verify_proposal">Force Verify</option>
            <option value="force_reject_proposal">Force Reject</option>
            <option value="escalate_unclaimed_proposal">Dept Escalation</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 w-44 sm:w-52"
            />
          </div>

          {/* CSV Export Button */}
          <button
            type="button"
            onClick={exportLogsCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors shadow-2xs"
            title="Download CSV Audit Log"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Timestamp & ID</th>
                <th className="px-4 py-3">Administrator</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3">Mandatory Justification</th>
                <th className="px-4 py-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No audit records matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Timestamp */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono text-[11px] text-slate-700">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.id}
                      </span>
                    </td>

                    {/* Administrator */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-slate-900 leading-tight">
                        {log.adminName}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.adminEmail}
                      </span>
                    </td>

                    {/* Action Type */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getActionBadge(log.actionType)}
                    </td>

                    {/* Target */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {log.targetType}:{log.targetId}
                      </span>
                    </td>

                    {/* Justification */}
                    <td className="px-4 py-3 max-w-sm">
                      <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                        {log.justification}
                      </p>
                    </td>

                    {/* Metadata button */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {log.metadata && Object.keys(log.metadata).length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSelectedMetadata({ id: log.id, data: log.metadata })}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-teal-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Code className="w-3 h-3" /> JSON
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Metadata Inspector Modal */}
      {selectedMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-900 font-mono">
                Payload Metadata: {selectedMetadata.id}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedMetadata(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-60">
              {JSON.stringify(selectedMetadata.data, null, 2)}
            </pre>
            <PrimaryButton
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedMetadata(null)}
            >
              Done
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};
