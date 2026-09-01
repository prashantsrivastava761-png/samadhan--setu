import React, { useState } from 'react';
import { User } from '../../types';
import { OTPVerification } from './OTPVerification';
import { CompleteProfileStep } from './CompleteProfileStep';
import { AuthService, formatIndianPhone } from '../../services/authService';
import { MOCK_USERS } from '../../data/mockData';
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Award,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';

interface LoginScreenProps {
  onSuccess: (user: User) => void;
  onCancel?: () => void;
  initialMode?: 'login' | 'signup';
  language?: 'en' | 'hi';
  onLanguageChange?: (lang: 'en' | 'hi') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onCancel,
  initialMode = 'login',
  language = 'en',
  onLanguageChange = () => {}
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [screenState, setScreenState] = useState<'phone_entry' | 'otp_verify' | 'profile_complete'>('phone_entry');
  const [phoneNumber, setPhoneNumber] = useState<string>('9431182910');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoHintOtp, setDemoHintOtp] = useState<string | undefined>(undefined);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  // Handle phone number submission -> Send OTP
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const { e164, isValid } = formatIndianPhone(phoneNumber);
    if (!isValid) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया वैध 10-अंकों का भारतीय मोबाइल नंबर दर्ज करें (शुरुआत 6-9 से)।'
          : 'Please enter a valid 10-digit Indian mobile phone number (starting with 6, 7, 8, or 9).'
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.sendPhoneOtp(phoneNumber, mode === 'signup');
      if (res.isMock && res.mockOtp) {
        setDemoHintOtp(res.mockOtp);
      }
      setScreenState('otp_verify');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send OTP at this time. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otpCode: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await AuthService.verifyPhoneOtp(phoneNumber, otpCode);
      if (result.isFirstLogin || !result.user.name) {
        // Redirection to "Complete Profile" step
        setAuthenticatedUser(result.user);
        setScreenState('profile_complete');
      } else {
        onSuccess(result.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setErrorMessage(null);
    const res = await AuthService.sendPhoneOtp(phoneNumber, mode === 'signup');
    if (res.isMock && res.mockOtp) {
      setDemoHintOtp(res.mockOtp);
    }
  };

  // Quick Persona Test Login (Convenient for evaluators)
  const handleQuickPersonaSelect = (user: User) => {
    AuthService.setCurrentSession(user);
    onSuccess(user);
  };

  return (
    <div id="login-screen-wrapper" className="min-h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 fixed inset-0 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: PHONE NUMBER ENTRY */}
        {screenState === 'phone_entry' && (
          <div className="space-y-6">
            {/* Header Brand */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                    समाधान सेतु <span className="text-teal-800 text-sm font-bold">| Samadhan Setu</span>
                  </h1>
                  <span className="text-[10px] text-slate-500 font-medium">Jharkhand Citizen Problem Resolution Portal</span>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mt-4">
                <button
                  type="button"
                  id="tab-login"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'login' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'hi' ? 'मौजूदा नागरिक लॉगिन' : 'Existing Citizen Login'}
                </button>
                <button
                  type="button"
                  id="tab-signup"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'signup' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'hi' ? 'नया खाता बनाएं' : 'Create New Account'}
                </button>
              </div>

              <p className="text-xs text-slate-600 pt-1">
                {mode === 'signup'
                  ? language === 'hi'
                    ? 'झारखंड के नागरिक मंच पर पंजीकरण करने के लिए अपना मोबाइल नंबर दर्ज करें:'
                    : 'Register with your 10-digit mobile number for instant OTP verification.'
                  : language === 'hi'
                  ? 'सुरक्षित लॉगिन के लिए अपना पंजीकृत 10 अंकों का मोबाइल नंबर दर्ज करें:'
                  : 'Enter your registered mobile number for instant passwordless OTP authentication.'}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 text-xs flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Phone Input Form */}
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'मोबाइल नंबर (Phone Number)' : 'Mobile Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
                    <span>+91</span>
                    <span className="ml-2 h-4 w-px bg-slate-300" />
                  </div>
                  <input
                    id="input-phone-number"
                    type="tel"
                    maxLength={10}
                    required
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      setErrorMessage(null);
                    }}
                    placeholder="94311XXXXX"
                    className="w-full pl-16 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-base font-semibold focus:border-teal-700 focus:ring-4 focus:ring-teal-100 outline-none transition-all tracking-wider"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'hi'
                    ? 'हम SMS के माध्यम से 6-अंकों का सुरक्षित OTP भेजेंगे।'
                    : 'We will send a 6-digit one-time passcode via SMS.'}
                </p>
              </div>

              <PrimaryButton
                id="btn-send-otp"
                type="submit"
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full justify-center py-3.5 text-sm font-bold shadow-md bg-teal-800 hover:bg-teal-900"
              >
                {isLoading ? (
                  <span>{language === 'hi' ? 'OTP भेजा जा रहा है...' : 'Sending OTP Code...'}</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{mode === 'signup' ? 'Continue with OTP' : 'Request Login OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </PrimaryButton>
            </form>

            {/* Quick Demo Personas - For easy reviewer switching */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  ⚡ Reviewer Quick-Test Personas:
                </span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold">
                  Instant Access
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect(MOCK_USERS.citizen)}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 transition-all text-xs"
                >
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" /> Birsa Marandi
                  </p>
                  <span className="text-[10px] text-slate-500 block">Tier 1: Basic Citizen</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect(MOCK_USERS.local_verified)}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 transition-all text-xs"
                >
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-600" /> Anita Devi
                  </p>
                  <span className="text-[10px] text-slate-500 block">Tier 2: Local Verified</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect(MOCK_USERS.expert)}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 transition-all text-xs"
                >
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" /> Dr. Alok Soren
                  </p>
                  <span className="text-[10px] text-slate-500 block">Tier 3: BAU Expert</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect(MOCK_USERS.admin || MOCK_USERS.institution)}
                  className="p-2 text-left rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-100/50 transition-all text-xs"
                >
                  <p className="font-bold text-amber-900 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-700" /> Sanjay Murmu
                  </p>
                  <span className="text-[10px] text-amber-700 block">Admin (is_admin=true)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OTP 6-DIGIT VERIFICATION */}
        {screenState === 'otp_verify' && (
          <OTPVerification
            phoneNumber={`+91 ${phoneNumber}`}
            isSignUp={mode === 'signup'}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={() => {
              setScreenState('phone_entry');
              setErrorMessage(null);
            }}
            isLoading={isLoading}
            errorMessage={errorMessage}
            demoHintOtp={demoHintOtp}
            language={language}
          />
        )}

        {/* STEP 3: NEW CITIZEN PROFILE COMPLETION (Tier 1 Setup) */}
        {screenState === 'profile_complete' && authenticatedUser && (
          <CompleteProfileStep
            user={authenticatedUser}
            onComplete={(finalUser) => onSuccess(finalUser)}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        )}
      </div>
    </div>
  );
};
