import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';

interface OTPVerificationProps {
  phoneNumber: string;
  isSignUp?: boolean;
  onVerify: (otpCode: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  demoHintOtp?: string;
  language?: 'en' | 'hi';
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  isSignUp = false,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  errorMessage = null,
  demoHintOtp,
  language = 'en'
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto countdown for 30s resend cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Focus the first empty box on initial render
  useEffect(() => {
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIdx = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    inputRefs.current[targetIdx]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    setLocalError(null);
    const sanitized = value.replace(/\D/g, '');

    if (!sanitized) {
      // Clear current digit
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      return;
    }

    // Handle single character
    const char = sanitized.slice(-1);
    const updated = [...digits];
    updated[index] = char;
    setDigits(updated);

    // Auto-focus next input box
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits filled
    if (index === 5 && char) {
      const fullCode = updated.join('');
      if (fullCode.length === 6) {
        onVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box and clear
        inputRefs.current[index - 1]?.focus();
        const updated = [...digits];
        updated[index - 1] = '';
        setDigits(updated);
      } else {
        const updated = [...digits];
        updated[index] = '';
        setDigits(updated);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasteData[i] || '';
      }
      setDigits(newDigits);

      if (pasteData.length === 6) {
        inputRefs.current[5]?.focus();
        onVerify(pasteData);
      } else {
        const nextIdx = Math.min(pasteData.length, 5);
        inputRefs.current[nextIdx]?.focus();
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = digits.join('');
    if (otpCode.length !== 6) {
      setLocalError(
        language === 'hi'
          ? 'कृपया सभी 6 अंकों का OTP दर्ज करें।'
          : 'Please enter all 6 digits of the verification code.'
      );
      return;
    }
    onVerify(otpCode);
  };

  const handleTriggerResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setLocalError(null);
    try {
      await onResend();
      setTimer(30);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const activeError = localError || errorMessage;

  return (
    <div id="otp-verification-screen" className="space-y-6">
      {/* Header Info */}
      <div className="space-y-2 text-center sm:text-left">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-800 transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'मोबाइल नंबर बदलें' : 'Change Phone Number'}</span>
        </button>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'OTP सत्यापन कोड दर्ज करें' : 'Verify Mobile OTP'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {language === 'hi'
            ? `हमने ${phoneNumber} पर 6 अंकों का सत्यापन कोड भेजा है:`
            : `We've sent a 6-digit authentication OTP to ${phoneNumber}:`}
        </p>
      </div>

      {/* Demo helper banner if in sandbox mode */}
      {demoHintOtp && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-xs text-teal-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="font-medium">
              Demo Testing Code: <strong className="font-mono text-sm tracking-widest text-teal-950 font-bold">{demoHintOtp}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const splitted = demoHintOtp.split('').slice(0, 6);
              setDigits(splitted);
              inputRefs.current[5]?.focus();
            }}
            className="text-[11px] font-bold text-teal-700 hover:underline bg-white px-2 py-0.5 rounded-lg border border-teal-300"
          >
            Auto-Fill
          </button>
        </div>
      )}

      {/* Error state alert */}
      {activeError && (
        <div
          id="otp-error-banner"
          className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 text-xs flex items-start gap-2.5 animate-shake"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{activeError}</div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* 6 Digit Input Boxes with Auto-focus */}
        <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={`otp-box-${idx}`}
              id={`otp-box-${idx}`}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={isLoading}
              className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all outline-none ${
                activeError
                  ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-100'
                  : digit
                  ? 'border-teal-700 bg-teal-50/40 text-teal-950 shadow-xs'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:ring-4 focus:ring-teal-100'
              }`}
            />
          ))}
        </div>

        {/* Submit Verification Button */}
        <PrimaryButton
          id="btn-verify-otp"
          type="submit"
          disabled={isLoading || digits.join('').length !== 6}
          className="w-full justify-center py-3.5 text-sm font-bold shadow-md bg-teal-800 hover:bg-teal-900"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying Code...'}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>{language === 'hi' ? 'लॉगिन सत्यापित करें' : 'Confirm & Authenticate'}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </PrimaryButton>

        {/* Resend Timer & Action */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500">
            {language === 'hi' ? 'कोड नहीं मिला?' : "Didn't receive OTP?"}
          </span>
          {canResend ? (
            <button
              id="btn-resend-otp"
              type="button"
              onClick={handleTriggerResend}
              disabled={isResending}
              className="font-bold text-teal-800 hover:text-teal-950 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isResending && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span>{language === 'hi' ? 'नया OTP भेजें (Resend)' : 'Resend Code'}</span>
            </button>
          ) : (
            <span className="font-semibold text-slate-400 font-mono">
              {language === 'hi' ? `पुनः भेजें: ${timer}s` : `Resend available in ${timer}s`}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
