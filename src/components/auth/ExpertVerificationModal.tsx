import React, { useState } from 'react';
import { DomainType } from '../../types';
import { DOMAIN_CONFIG } from '../../data/mockData';
import { PrimaryButton } from '../common/PrimaryButton';
import { Award, Building2, Upload, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface ExpertVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (domain: DomainType, organization: string) => void;
}

export const ExpertVerificationModal: React.FC<ExpertVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [domain, setDomain] = useState<DomainType>('water');
  const [organization, setOrganization] = useState<string>('Birsa Agricultural University (BAU) Ranchi');
  const [workEmail, setWorkEmail] = useState<string>('alok.soren@bauranchi.ac.in');
  const [designation, setDesignation] = useState<string>('Assistant Professor - Hydrology & Water Resources');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(domain, organization);
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center animate-bounce">
              <Award className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Credentialed Expert Status Granted!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your academic & institutional credentials for <strong>{domain.toUpperCase()}</strong> have been verified with {organization}. You can now provide formal Expert Approvals on civic proposals.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Apply as Credentialed Expert (विशेषज्ञ प्रमाणीकरण)
                </h3>
                <p className="text-xs text-slate-500">
                  For University Faculty, Govt Engineers, Medical Officers & Scientists
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Domain Specialization (विशेषज्ञता का क्षेत्र) *
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as DomainType)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                >
                  {Object.entries(DOMAIN_CONFIG).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label} ({item.hindi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institutional Affiliation / Organization *
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. IIT (ISM) Dhanbad, BAU Ranchi, BIT Mesra, RIMS Ranchi"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Associate Professor, Lead Scientist"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institutional Email (.ac.in / .gov.in)
                  </label>
                  <input
                    type="email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="name@institute.ac.in"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Faculty ID / Professional License / Degree
                </label>
                <div className="border border-dashed border-amber-400 bg-amber-50/40 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-700" />
                    <span className="text-xs text-amber-950 font-semibold">
                      faculty_identity_credential_verified.pdf
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded font-medium">
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Expert endorsements carry official weight. Endorsed proposals are automatically fast-tracked to the Jharkhand Government Cabinet & University Project Cells.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PrimaryButton type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </PrimaryButton>
                <PrimaryButton type="submit" variant="accent" size="sm" isLoading={isSubmitting}>
                  Submit Credential Application
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
