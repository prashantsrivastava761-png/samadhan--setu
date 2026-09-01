import React, { useState } from 'react';
import { UnclaimedProposalAlert, EscalationDepartment } from '../../types/admin';
import { JHARKHAND_DEPARTMENTS } from '../../services/supabaseAdmin';
import { DomainTag } from '../common/DomainTag';
import { PrimaryButton } from '../common/PrimaryButton';
import {
  AlertOctagon,
  Send,
  Building,
  Mail,
  UserCheck,
  Clock,
  CheckCircle2,
  Calendar,
  IndianRupee,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface UnclaimedProposalsSectionProps {
  alerts: UnclaimedProposalAlert[];
  onEscalate: (alert: UnclaimedProposalAlert, department: EscalationDepartment) => void;
}

export const UnclaimedProposalsSection: React.FC<UnclaimedProposalsSectionProps> = ({
  alerts,
  onEscalate
}) => {
  const [selectedDeptMap, setSelectedDeptMap] = useState<Record<string, string>>({});

  const handleSelectDept = (proposalId: string, deptId: string) => {
    setSelectedDeptMap((prev) => ({ ...prev, [proposalId]: deptId }));
  };

  const pendingEscalations = alerts.filter((a) => a.escalationStatus === 'not_escalated');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Unclaimed Verified Proposals Escalation Backlog
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {pendingEscalations.length} Exceeded SLA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified civic proposals that have remained unclaimed by academic institutions or NGOs past the 14-day SLA window.
          </p>
        </div>
      </div>

      {/* Grid of Alerts */}
      {alerts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Unclaimed Verified Proposals Stalled</h4>
          <p className="text-xs text-slate-400 mt-1">
            All verified proposals have either been claimed by universities/implementers or escalated to the appropriate state government department.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const currentDeptId = selectedDeptMap[alert.proposalId] || JHARKHAND_DEPARTMENTS[0].id;
            const chosenDept = JHARKHAND_DEPARTMENTS.find((d) => d.id === currentDeptId) || JHARKHAND_DEPARTMENTS[0];
            const isEscalated = alert.escalationStatus === 'escalated_to_dept';

            return (
              <div
                key={alert.proposalId}
                className={`bg-white rounded-2xl border p-4.5 sm:p-5 transition-all shadow-2xs ${
                  isEscalated
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : 'border-amber-200/90 bg-amber-50/10'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Problem & Proposal details */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-700" /> {alert.daysUnclaimed} Days Unclaimed
                      </span>
                      <DomainTag domain={alert.domain} size="sm" />
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {alert.block}, {alert.district}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Civic Grievance: <span className="font-semibold text-slate-800">{alert.problemTitle}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span>Est. Budget: <strong className="text-slate-800">{alert.estimatedCost}</strong></span>
                      <span>•</span>
                      <span>Verified on: <strong>{new Date(alert.verifiedAt).toLocaleDateString('en-IN')}</strong></span>
                    </div>

                    {isEscalated && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>
                          Directly escalated to <strong>{alert.escalatedTo || 'Department'}</strong> on{' '}
                          {alert.lastEscalatedAt ? new Date(alert.lastEscalatedAt).toLocaleString('en-IN') : 'Recently'}.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Department Escalation Selector */}
                  <div className="w-full lg:w-80 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Building className="w-4 h-4 text-teal-700" />
                      <span>Target State Department</span>
                    </div>

                    {!isEscalated ? (
                      <>
                        <select
                          value={currentDeptId}
                          onChange={(e) => handleSelectDept(alert.proposalId, e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                        >
                          {JHARKHAND_DEPARTMENTS.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>

                        {/* Nodal Officer Contact info snippet */}
                        <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                          <p className="font-semibold text-slate-800 leading-tight">
                            Nodal Officer: {chosenDept.nodalOfficer}
                          </p>
                          <p className="text-slate-500 font-mono text-[10px] flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> {chosenDept.contactEmail}
                          </p>
                        </div>

                        <PrimaryButton
                          variant="accent"
                          size="sm"
                          className="w-full"
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                          onClick={() => onEscalate(alert, chosenDept)}
                        >
                          Escalate to Department
                        </PrimaryButton>
                      </>
                    ) : (
                      <div className="text-center py-2 space-y-1">
                        <span className="text-xs font-bold text-emerald-800 block">
                          Formal Notice Dispatched
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Tracking ID: ESC-{alert.proposalId.toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
