import React, { useState } from 'react';
import { ExpertApplication } from '../../types/admin';
import { DomainType } from '../../types';
import { DomainTag } from '../common/DomainTag';
import { PrimaryButton } from '../common/PrimaryButton';
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building,
  GraduationCap,
  Mail,
  FileCheck,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

interface PendingExpertApplicationsProps {
  applications: ExpertApplication[];
  onApprove: (app: ExpertApplication) => void;
  onReject: (app: ExpertApplication) => void;
}

export const PendingExpertApplications: React.FC<PendingExpertApplicationsProps> = ({
  applications,
  onApprove,
  onReject
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (selectedDomain !== 'all' && app.domain !== selectedDomain) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.fullName.toLowerCase().includes(q) ||
        app.institution.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Subheader & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Tier 3 Expert Upgrade Applications
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Credentialed experts receive unilateral technical veto and fast-track approval rights across their domain.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
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
              Pending ({pendingCount})
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
              All ({applications.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty or institute..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 w-48 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Expert Applications Found</h4>
          <p className="text-xs text-slate-400 mt-1">
            {statusFilter === 'pending'
              ? 'All submitted Tier 3 credential verification requests have been moderated.'
              : 'Try clearing your search query or domain filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={`bg-white rounded-2xl border p-4.5 sm:p-5 flex flex-col justify-between transition-all shadow-2xs ${
                app.status === 'pending'
                  ? 'border-amber-200/90 hover:border-amber-400'
                  : app.status === 'approved'
                  ? 'border-emerald-200 bg-emerald-50/10'
                  : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              <div>
                {/* Header with Applicant Name, Domain & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {app.fullName}
                      </h3>
                      <DomainTag domain={app.domain} size="sm" />
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
                      {app.designation}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>

                {/* Institution & Email Verification Box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-semibold">{app.institution}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{app.email}</span>
                    </div>

                    {app.isDomainInstitutional ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
                        <ShieldCheck className="w-3 h-3 text-teal-700" /> Official .ac.in / .gov.in
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-700" /> Generic Domain ({app.emailDomain})
                      </span>
                    )}
                  </div>
                </div>

                {/* Credentials & Summary */}
                <div className="space-y-2 text-xs text-slate-600 mb-3">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                      Expertise & Background ({app.experienceYears} Years Experience):
                    </span>
                    <p className="leading-relaxed text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                      {app.credentialsSummary}
                    </p>
                  </div>

                  {app.publishedPapersOrProjects && (
                    <div className="text-[11px] text-slate-500 italic bg-teal-50/50 p-2 rounded-xl border border-teal-100/60">
                      <strong className="not-italic text-teal-900 font-bold">Notable Research / Project:</strong> {app.publishedPapersOrProjects}
                    </div>
                  )}

                  {app.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs">
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProofUrl(app.idProofUrl)}
                  className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  View Uploaded ID Proof
                </button>

                {app.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onReject(app)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                    <PrimaryButton
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => onApprove(app)}
                    >
                      Approve Tier 3
                    </PrimaryButton>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium italic">
                    Moderated on {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ID Proof Preview Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-700" />
                Submitted Identification Proof
              </h4>
              <button
                type="button"
                onClick={() => setSelectedProofUrl(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-80 flex items-center justify-center">
              <img
                src={selectedProofUrl}
                alt="ID Proof"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              Verified against faculty/department registry before granting Tier 3 privileges.
            </p>
            <PrimaryButton
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedProofUrl(null)}
            >
              Done Reviewing
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};
