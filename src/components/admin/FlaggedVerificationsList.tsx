import React, { useState } from 'react';
import { FlaggedVerification } from '../../types/admin';
import { DomainTag } from '../common/DomainTag';
import { PrimaryButton } from '../common/PrimaryButton';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wifi,
  Clock,
  MapPin,
  Users,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';

interface FlaggedVerificationsListProps {
  flags: FlaggedVerification[];
  onOverride: (flag: FlaggedVerification) => void;
  onDismiss: (flag: FlaggedVerification) => void;
  onInspectProposal?: (proposalId: string) => void;
}

export const FlaggedVerificationsList: React.FC<FlaggedVerificationsListProps> = ({
  flags,
  onOverride,
  onDismiss,
  onInspectProposal
}) => {
  const [statusFilter, setStatusFilter] = useState<'pending' | 'all' | 'resolved'>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFlags = flags.filter((f) => {
    if (statusFilter === 'pending' && f.status !== 'pending') return false;
    if (statusFilter === 'resolved' && f.status === 'pending') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.problemTitle.toLowerCase().includes(q) ||
        f.proposalTitle.toLowerCase().includes(q) ||
        f.flagReason.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = flags.filter((f) => f.status === 'pending').length;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-rose-700" /> CRITICAL ABUSE RISK
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-700" /> HIGH ANOMALY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
            <Info className="w-3 h-3 text-blue-700" /> MEDIUM RISK
          </span>
        );
    }
  };

  const getFlagCodeIcon = (code: string) => {
    switch (code) {
      case 'SAME_IP_BURST':
        return <Wifi className="w-4 h-4 text-rose-600" />;
      case 'RAPID_SUBMISSION':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'GEO_MISMATCH':
        return <MapPin className="w-4 h-4 text-purple-600" />;
      default:
        return <Users className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Flagged Verification & Sybil Detection Alerts
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-200">
              {pendingCount} Active Flags
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated heuristical monitoring catches duplicate device fingerprints, IP proxy farms, and rapid quorum clustering.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-white text-teal-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-teal-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All History ({flags.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search flags or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 w-44 sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* Flag Items List */}
      {filteredFlags.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Flagged Verifications Pending</h4>
          <p className="text-xs text-slate-400 mt-1">
            All automated quorum and expert verification signals are within expected safety thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs ${
                flag.status === 'pending'
                  ? 'border-rose-200/90 bg-rose-50/10'
                  : flag.status === 'overridden'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 bg-slate-50/50 opacity-85'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left Info Column */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSeverityBadge(flag.severity)}
                    <DomainTag domain={flag.domain} size="sm" />
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {flag.district}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Detected: {new Date(flag.detectedAt).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {flag.proposalTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Parent Problem: <span className="font-semibold text-slate-700">{flag.problemTitle}</span>
                    </p>
                  </div>

                  {/* Flag Reason Banner */}
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{getFlagCodeIcon(flag.flagCode)}</div>
                    <div>
                      <span className="text-xs font-bold text-rose-950 block">
                        Flag Reason: {flag.flagReason}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-rose-800 mt-1 font-mono flex-wrap">
                        {flag.anomalyDetails.ipSubnet && (
                          <span>IP Subnet: {flag.anomalyDetails.ipSubnet}</span>
                        )}
                        {flag.anomalyDetails.submissionDurationSeconds && (
                          <span>Submission Window: {flag.anomalyDetails.submissionDurationSeconds}s</span>
                        )}
                        {flag.anomalyDetails.geoDistanceKm && (
                          <span>Geo Discrepancy: {flag.anomalyDetails.geoDistanceKm} km</span>
                        )}
                        {flag.anomalyDetails.suspiciousVoterIds && (
                          <span>Suspect Voter IDs: {flag.anomalyDetails.suspiciousVoterIds.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Resolution Notes if present */}
                  {flag.adminNotes && (
                    <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong className="text-slate-900 font-bold">Admin Resolution Justification:</strong> {flag.adminNotes}
                    </div>
                  )}
                </div>

                {/* Right Action Column */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {flag.status === 'pending' ? (
                    <>
                      <PrimaryButton
                        variant="primary"
                        size="sm"
                        className="w-full sm:w-auto"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        onClick={() => onOverride(flag)}
                      >
                        Override & Force Pass
                      </PrimaryButton>

                      <button
                        type="button"
                        onClick={() => onDismiss(flag)}
                        className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors w-full sm:w-auto text-center"
                      >
                        Dismiss as False Positive
                      </button>
                    </>
                  ) : (
                    <div className="text-right space-y-1">
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                        flag.status === 'overridden'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        Status: {flag.status === 'overridden' ? 'Overridden by Admin' : 'Dismissed'}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Resolved {flag.resolvedAt ? new Date(flag.resolvedAt).toLocaleDateString('en-IN') : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
