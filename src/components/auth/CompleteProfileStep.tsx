import React, { useState } from 'react';
import { User } from '../../types';
import { JHARKHAND_DISTRICTS } from '../../data/mockData';
import { PrimaryButton } from '../common/PrimaryButton';
import { AuthService } from '../../services/authService';
import { UserCheck, Sparkles, Languages, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface CompleteProfileStepProps {
  user: User;
  onComplete: (updatedUser: User) => void;
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
}

export const CompleteProfileStep: React.FC<CompleteProfileStepProps> = ({
  user,
  onComplete,
  language,
  onLanguageChange
}) => {
  const [name, setName] = useState<string>('');
  const [district, setDistrict] = useState<string>(user.district || 'Ranchi');
  const [block, setBlock] = useState<string>(user.block || 'Kanke');
  const [pincode, setPincode] = useState<string>(user.pincode || '834001');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(language);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(
        selectedLanguage === 'hi'
          ? 'कृपया अपना पूरा नाम दर्ज करें।'
          : 'Please enter your full name to complete registration.'
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await AuthService.completeProfile(user.id, {
        name: name.trim(),
        preferredLanguage: selectedLanguage,
        district,
        block,
        pincode
      });
      onLanguageChange(selectedLanguage);
      onComplete(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="complete-profile-step" className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{selectedLanguage === 'hi' ? 'स्वागत है!' : 'Welcome to Samadhan Setu!'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {selectedLanguage === 'hi' ? 'अपनी प्रोफ़ाइल पूरी करें' : 'Complete Your Civic Profile'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {selectedLanguage === 'hi'
            ? 'झारखंड के नागरिक मंच पर आपकी पहचान और स्थानीय भागीदारी के लिए कुछ बुनियादी जानकारी:'
            : 'Set up your citizen account to start filing issues, voting on local solutions, and tracking public works.'}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            {selectedLanguage === 'hi' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
          </label>
          <input
            id="input-full-name"
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder={selectedLanguage === 'hi' ? 'उदा. बिरसा मुंडा' : 'e.g. Birsa Marandi'}
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:border-teal-700 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
          />
        </div>

        {/* Preferred Language Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-teal-700" />
            <span>{selectedLanguage === 'hi' ? 'पसंदीदा भाषा (Preferred Language)' : 'Preferred Interface Language'}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedLanguage('hi')}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                selectedLanguage === 'hi'
                  ? 'border-teal-700 bg-teal-50/60 text-teal-950 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <p className="text-sm font-bold">हिंदी (Hindi)</p>
              <span className="text-[10px] text-slate-500 block mt-0.5">स्थानीय भाषा में अनुभव</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('en')}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                selectedLanguage === 'en'
                  ? 'border-teal-700 bg-teal-50/60 text-teal-950 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <p className="text-sm font-bold">English</p>
              <span className="text-[10px] text-slate-500 block mt-0.5">English interface</span>
            </button>
          </div>
        </div>

        {/* Primary District & Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {selectedLanguage === 'hi' ? 'जिला (District)' : 'District (Jharkhand)'}
            </label>
            <select
              id="select-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:border-teal-700 focus:ring-4 focus:ring-teal-100 outline-none"
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {selectedLanguage === 'hi' ? 'पिनकोड (Pincode)' : 'Pincode'}
            </label>
            <input
              id="input-pincode"
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:border-teal-700 focus:ring-4 focus:ring-teal-100 outline-none"
            />
          </div>
        </div>

        {/* Initial Tier Note */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <UserCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Assigned: Tier 1 (Registered Citizen)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            You can immediately upgrade to Tier 2 (Local Verified) with voter/ration card or Tier 3 (Expert) after setup.
          </p>
        </div>

        <PrimaryButton
          id="btn-complete-profile-submit"
          type="submit"
          disabled={isSubmitting}
          className="w-full justify-center py-3.5 text-sm font-bold shadow-md bg-teal-800 hover:bg-teal-900"
        >
          <span className="flex items-center gap-2">
            <span>{selectedLanguage === 'hi' ? 'खाता सक्रिय करें (Get Started)' : 'Save & Enter Samadhan Setu'}</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </PrimaryButton>
      </form>
    </div>
  );
};
