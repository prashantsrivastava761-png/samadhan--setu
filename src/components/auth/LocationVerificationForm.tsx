import React, { useState } from 'react';
import { JHARKHAND_DISTRICTS } from '../../data/mockData';
import { PrimaryButton } from '../common/PrimaryButton';
import { AuthService } from '../../services/authService';
import {
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Info,
  X,
  FileCheck2
} from 'lucide-react';

interface LocationVerificationFormProps {
  userId: string;
  initialDistrict?: string;
  initialBlock?: string;
  initialPincode?: string;
  onSuccess: (updatedUser: any) => void;
  onCancel: () => void;
  language?: 'en' | 'hi';
}

export const LocationVerificationForm: React.FC<LocationVerificationFormProps> = ({
  userId,
  initialDistrict = 'Ranchi',
  initialBlock = 'Tamar',
  initialPincode = '835225',
  onSuccess,
  onCancel,
  language = 'en'
}) => {
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [block, setBlock] = useState<string>(initialBlock);
  const [pincode, setPincode] = useState<string>(initialPincode);
  const [address, setAddress] = useState<string>('Salgadih Gram Panchayat, Ward 3');
  const [idType, setIdType] = useState<'voter_id' | 'ration_card' | 'aadhaar_address' | 'pradhan_cert'>(
    'voter_id'
  );
  const [idNumber, setIdNumber] = useState<string>('JHR/2024/09812');
  const [fileName, setFileName] = useState<string>('voter_card_residence_tamar.jpg');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setError(language === 'hi' ? 'कृपया वैध 6-अंकों का पिनकोड दर्ज करें।' : 'Please enter a valid 6-digit postal pincode.');
      return;
    }
    if (!address.trim()) {
      setError(language === 'hi' ? 'कृपया अपना स्थानीय पता दर्ज करें।' : 'Please specify your village / ward address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      /**
       * MOCK VERIFICATION HOOK:
       * ==============================================================================
       * [REAL KYC / DIGILOCKER INTEGRATION POINT]:
       * In production, this handler calls Jharkhand e-District / DigiLocker API or 
       * Election Commission EPIC OCR verification to confirm voter card / Aadhaar address.
       * e.g., await DigiLockerClient.verifyResidency({ idType, idNumber, pincode });
       * ==============================================================================
       */
      const updatedUser = await AuthService.verifyLocation(userId, {
        pincode,
        district,
        block,
        address,
        idProofName: fileName
      });

      onSuccess(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Location verification failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="location-verification-form" className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Tier 2 Upgrade</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {language === 'hi' ? 'स्थानीय निवास सत्यापन (Residency KYC)' : 'Verify Local Residency & Pincode'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'स्थानीय सत्यापित नागरिक बनकर अपने प्रखंड की समस्याओं और समाधानों पर कोरम मतदान (Quorum Vote) का अधिकार पाएं।'
              : 'Unlock local Quorum Voting rights to formally validate civic proposals in your block.'}
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

      {/* Integration Notice Box */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Govt KYC & DigiLocker Gateway Plug-in:</p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Simulated residency check against Jharkhand State GIS & Electoral database. Address proof is cross-referenced with your registered pincode.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* District & Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">District *</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Block / Tehsil *</label>
            <input
              type="text"
              required
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder="e.g. Tamar, Kanke, Ormanjhi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>
        </div>

        {/* Pincode & Street/Village */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">6-Digit Pincode *</label>
            <input
              type="text"
              required
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Gram Panchayat / Village / Ward Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Salgadih Gram Panchayat, Ward 3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:border-teal-700 outline-none"
            />
          </div>
        </div>

        {/* ID Document Proof Selection */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-700">Proof of Local Residence *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'voter_id', label: 'Voter ID (EPIC)' },
              { id: 'ration_card', label: 'Ration Card' },
              { id: 'aadhaar_address', label: 'Aadhaar Card' },
              { id: 'pradhan_cert', label: 'Mukhia Certificate' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setIdType(t.id as any)}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all text-center ${
                  idType === t.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mock File Upload Attachment */}
        <div className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-4 text-center bg-slate-50/50 transition-colors">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Attached Document: <span className="text-teal-800 font-mono">{fileName}</span>
            </p>
            <span className="text-[11px] text-slate-400">PDF, JPG or PNG (Max 5MB) • DigiLocker e-Signed</span>
          </div>
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
            className="px-6 py-2.5 text-xs font-bold bg-blue-700 hover:bg-blue-800"
          >
            {isSubmitting ? (
              <span>Validating KYC...</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Submit & Upgrade to Tier 2</span>
              </span>
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
