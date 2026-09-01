import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X,
  Lock,
  FileText,
  Loader2
} from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';

export interface AdminConfirmationConfig {
  isOpen: boolean;
  title: string;
  actionName: string;
  actionType: 'danger' | 'warning' | 'success' | 'info';
  targetTitle: string;
  targetSubtitle?: string;
  warningNote?: string;
  requiresAcknowledgment?: boolean;
  defaultJustification?: string;
  onConfirm: (justification: string) => Promise<void> | void;
  onCancel: () => void;
}

export const AdminConfirmationModal: React.FC<AdminConfirmationConfig> = ({
  isOpen,
  title,
  actionName,
  actionType,
  targetTitle,
  targetSubtitle,
  warningNote,
  requiresAcknowledgment = true,
  defaultJustification = '',
  onConfirm,
  onCancel
}) => {
  const [justification, setJustification] = useState<string>(defaultJustification);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification || justification.trim().length < 5) {
      setErrorMsg('A detailed justification of at least 5 characters is required for regulatory audit logging.');
      return;
    }
    if (requiresAcknowledgment && !acknowledged) {
      setErrorMsg('You must check the confirmation acknowledgment box before proceeding.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onConfirm(justification.trim());
      setJustification('');
      setAcknowledged(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Action failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeStyles = () => {
    switch (actionType) {
      case 'danger':
        return {
          iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
          badge: 'bg-rose-50 text-rose-800 border-rose-200',
          btnVariant: 'danger' as const
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
          badge: 'bg-amber-50 text-amber-900 border-amber-200',
          btnVariant: 'accent' as const
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          btnVariant: 'primary' as const
        };
      default:
        return {
          iconBg: 'bg-teal-100 text-teal-800 border-teal-200',
          badge: 'bg-teal-50 text-teal-900 border-teal-200',
          btnVariant: 'primary' as const
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-2xs ${theme.iconBg}`}>
                {actionType === 'danger' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${theme.badge}`}>
                  Audit Action: {actionName}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Target Information Card */}
            <div className="p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Target Entity
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {targetTitle}
              </p>
              {targetSubtitle && (
                <p className="text-xs text-slate-600 font-medium">{targetSubtitle}</p>
              )}
            </div>

            {/* Warning Note if applicable */}
            {warningNote && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {warningNote}
                </p>
              </div>
            )}

            {/* Mandatory Justification Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  Admin Justification & Reason <span className="text-rose-600">*</span>
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  {justification.length} chars (min 5)
                </span>
              </div>
              <textarea
                required
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Enter formal justification, official order number, or field audit findings (will be permanently stored in admin_actions table)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900 bg-white placeholder-slate-400"
              />
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Logged to immutable audit ledger with your admin ID & timestamp.</span>
              </div>
            </div>

            {/* Acknowledgment Checkbox */}
            {requiresAcknowledgment && (
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 mt-0.5"
                />
                <span className="text-xs text-slate-700 font-medium leading-tight">
                  I certify that this administrative intervention complies with Jharkhand Civic Moderation guidelines and cannot be silently undone.
                </span>
              </label>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <PrimaryButton
                type="submit"
                variant={theme.btnVariant}
                size="md"
                disabled={isSubmitting || (requiresAcknowledgment && !acknowledged) || justification.trim().length < 5}
                leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              >
                {isSubmitting ? 'Writing to Audit Log...' : `Confirm ${actionName}`}
              </PrimaryButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
