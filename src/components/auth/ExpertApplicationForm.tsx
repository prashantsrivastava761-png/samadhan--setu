import React, { useState } from 'react';
import { User, DomainType } from '../../types';
import { DOMAIN_CONFIG } from '../../data/mockData';
import { PrimaryButton } from '../common/PrimaryButton';
import { AuthService } from '../../services/authService';
import {
  Award,
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  X,
  FileText,
  Clock
} from 'lucide-react';

interface ExpertApplicationFormProps {
  currentUser: User;
  onSuccess: (result: { autoApproved: boolean; updatedUser?: User }) => void;
  onCancel: () => void;
  language?: 'en' | 'hi';
}

export const ExpertApplicationForm: React.FC<ExpertApplicationFormProps> = ({
  currentUser,
  onSuccess,
  onCancel,
  language = 'en'
}) => {
  const [fullName, setFullName] = useState<string>(currentUser.name || 'Dr. Alok Kumar Soren');
  const [email, setEmail] = useState<string>('alok.soren@bauranchi.ac.in');
  const [institution, setInstitution] = useState<string>('Birsa Agricultural University (BAU) Ranchi');
  const [designation, setDesignation] = useState<string>('Assistant Professor - Hydrology & Water Resources');
  const [domain, setDomain] = useState<DomainType>('water');
  const [experienceYears, setExperienceYears] = useState<number>(7);
  const [credentialsSummary, setCredentialsSummary] = useState<string>(
    'Ph.D. in Water Resources Engineering with 12 published papers on fluoride and heavy-metal remediation in Chota Nagpur plateau aquifers.'
  );
  const [publications, setPublications] = useState<string>(
    '1. Fluoride Adsorption in Tribal Aquifers (2024, J. Hydrology)\n2. Solar Pumping Feasibility in Jharkhand (2025)'
  );
  const [fileName, setFileName] = useState<string>('faculty_appointment_bau.pdf');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const emailDomain = email.split('@')[1]?.toLowerCase() || '';
  const isAutoApprovable =
    emailDomain.endsWith('.ac.in') ||
    emailDomain.endsWith('.edu.in') ||
    emailDomain.includes('nic.in') ||
    emailDomain.includes('gov.in');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please provide a valid official work or institutional email.');
      return;
    }
    if (!institution.trim() || !designation.trim()) {
      setError('Please provide your current institution and academic/professional designation.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await AuthService.applyForExpert(currentUser, {
        fullName,
        email,
        institution,
        designation,
        domain,
        experienceYears,
        credentialsSummary,
        idProofUrl: fileName,
        publishedPapersOrProjects: publications
      });

      onSuccess({
        autoApproved: result.autoApproved,
        updatedUser: result.updatedUser
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit expert application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="expert-application-form" className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Tier 3 Upgrade</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {language === 'hi' ? 'विशेषज्ञ सत्यापन आवेदन (Domain Expert Application)' : 'Apply for Tier 3 Domain Expert Status'}
          </h3>
          <p className="text-xs text-slate-500">
            Faculty, researchers, and licensed engineers can approve technical feasibility proposals and unlock civic grant matching.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Auto-Approval Notification Banner */}
      {isAutoApprovable ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold flex items-center gap-1">
              <span>Instant Auto-Approval Enabled:</span>
              <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-[11px] font-black">
                @{emailDomain}
              </span>
            </p>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Verified recognized Indian academic / government institution domain detected. Tier 3 Expert Status will be granted immediately upon submission!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Manual Review Queue Notice:</p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Applications without a recognized <code className="font-mono font-bold">.ac.in / .edu.in</code> email domain will be routed to the <strong>Admin Moderation Queue</strong> for verification of attached credential proofs.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Domain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Primary Domain Expertise *</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as DomainType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            >
              {Object.entries(DOMAIN_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label} ({cfg.labelHindi})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Work Email & Institutional Affiliation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Work / Academic Email *</span>
              <span className="text-[10px] text-teal-700 font-bold">.ac.in for instant approval</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alok.soren@bauranchi.ac.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">University / Research Institution *</label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Birsa Agricultural University, BIT Mesra, IIT ISM"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>
        </div>

        {/* Designation & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Academic / Official Designation *</label>
            <input
              type="text"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Associate Professor, Senior Scientist"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Years of Experience</label>
            <input
              type="number"
              min={1}
              max={50}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>
        </div>

        {/* Credentials & Bio */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Technical Qualifications & Research Focus</label>
          <textarea
            rows={2}
            value={credentialsSummary}
            onChange={(e) => setCredentialsSummary(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:border-teal-700 outline-none resize-none"
          />
        </div>

        {/* File Proof Attachment */}
        <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-3.5 text-center bg-slate-50/50">
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 text-amber-700" />
            <p className="text-xs font-bold text-slate-800">
              Attached ID Proof: <span className="text-amber-800 font-mono">{fileName}</span>
            </p>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Faculty ID, Appointment Letter, or Council Registration PDF</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isSubmitting ? (
              <span>Submitting Application...</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{isAutoApprovable ? 'Instant Verify & Upgrade' : 'Submit for Admin Review'}</span>
              </span>
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
