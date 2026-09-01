import React, { useState } from 'react';
import { JHARKHAND_DISTRICTS } from '../../data/mockData';
import { PrimaryButton } from '../common/PrimaryButton';
import { ShieldCheck, MapPin, Upload, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface LocationVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pincode: string, district: string, block: string) => void;
}

export const LocationVerificationModal: React.FC<LocationVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pincode, setPincode] = useState<string>('835225');
  const [district, setDistrict] = useState<string>('Ranchi');
  const [block, setBlock] = useState<string>('Tamar');
  const [address, setAddress] = useState<string>('Salgadih Gram Panchayat, Ward 3');
  const [idType, setIdType] = useState<string>('voter_id');
  const [fileUploaded, setFileUploaded] = useState<boolean>(true);
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
        onSuccess(pincode, district, block);
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
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Local Residency Verified!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              You are now upgraded to <strong>Local Verified Tier</strong> in {district} ({pincode}). You can now cast Quorum votes on civic proposals!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Verify Local Residency (स्थानीय सत्यापन)
                </h3>
                <p className="text-xs text-slate-500">
                  Unlock Quorum voting rights for your Panchayat and District
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District (ज़िला) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  >
                    {JHARKHAND_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode (पिनकोड) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="834001"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Block / Municipality (प्रखंड)
                  </label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. Tamar, Kanke, Topchanchi"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ID Document Type
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  >
                    <option value="voter_id">Voter ID (EPIC)</option>
                    <option value="ration_card">Jharkhand Ration Card</option>
                    <option value="electricity_bill">JBVNL Electricity Bill</option>
                    <option value="pradhankala_certificate">Gram Pradhan Letter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Village / Ward, Landmark, Panchayat"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Proof of Residency (PDF or Photo)
                </label>
                <div className="border border-dashed border-teal-500 bg-teal-50/40 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                    <span className="text-xs text-teal-900 font-semibold">
                      voter_card_jharkhand_verified.jpg
                    </span>
                  </div>
                  <span className="text-[11px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-medium">
                    Ready
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  Auto-validated via State Resident Register database for instant Quorum enablement.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PrimaryButton type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </PrimaryButton>
                <PrimaryButton type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  Verify & Upgrade Tier
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
