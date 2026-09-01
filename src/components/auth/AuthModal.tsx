import React, { useState } from 'react';
import { User, UserTier } from '../../types';
import { PrimaryButton } from '../common/PrimaryButton';
import { ShieldCheck, Phone, KeyRound, CheckCircle2, ArrowRight, X, Sparkles, Building2, Award } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  usersList: Record<string, User>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  usersList
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'tier_select'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('9431182910');
  const [otp, setOtp] = useState<string[]>(['5', '8', '2', '4']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Default to citizen user or show tier select
      onLoginSuccess(usersList.citizen);
      onClose();
    }, 800);
  };

  const handleQuickLogin = (tier: UserTier) => {
    const userToLogin = usersList[tier] || usersList.citizen;
    onLoginSuccess(userToLogin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md mb-3 border border-teal-700">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Samadhan Setu <span className="text-teal-700">| समाधान सेतु</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Jharkhand Civic Problem-Solving & Verification Portal
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Enter Mobile Number (मोबाइल नंबर दर्ज करें)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="94311 XXXXX"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                We will send a 4-digit OTP for instant login. No password required.
              </p>
            </div>

            <PrimaryButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get OTP (ओटीपी प्राप्त करें)
            </PrimaryButton>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Enter 4-Digit OTP sent to +91 {phoneNumber}
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-teal-700 font-semibold hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="flex justify-between gap-2.5 my-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 text-slate-900 focus:outline-none"
                  />
                ))}
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Didn't receive? <span className="text-teal-700 font-semibold">Resend OTP in {resendTimer}s</span>
              </p>
            </div>

            <PrimaryButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isVerifying}
            >
              Verify & Proceed (सत्यापित करें)
            </PrimaryButton>
          </form>
        )}

        {/* Demo Fast-Switcher: Switch persona effortlessly for review */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Demo Persona Fast-Login (1-Click Switch):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('citizen')}
              className="p-2 rounded-xl border border-slate-200 hover:border-teal-600 bg-slate-50 hover:bg-teal-50 text-left text-xs transition-colors"
            >
              <span className="font-bold text-slate-800 block">👤 Birsa (Citizen)</span>
              <span className="text-[10px] text-slate-500">Ormanjhi, Ranchi</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('local_verified')}
              className="p-2 rounded-xl border border-slate-200 hover:border-teal-600 bg-slate-50 hover:bg-teal-50 text-left text-xs transition-colors"
            >
              <span className="font-bold text-teal-900 block flex items-center gap-1">
                🛡️ Anita (Verified)
              </span>
              <span className="text-[10px] text-slate-500">Topchanchi (Can Vote)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('expert')}
              className="p-2 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50 hover:bg-amber-50 text-left text-xs transition-colors"
            >
              <span className="font-bold text-amber-900 block flex items-center gap-1">
                🎖️ Dr. Soren (Expert)
              </span>
              <span className="text-[10px] text-slate-500">BAU Water Dept Lead</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('institution')}
              className="p-2 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50 hover:bg-blue-50 text-left text-xs transition-colors"
            >
              <span className="font-bold text-blue-900 block flex items-center gap-1">
                🏛️ Prof. Prasad (IIT)
              </span>
              <span className="text-[10px] text-slate-500">IIT (ISM) Implementer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
