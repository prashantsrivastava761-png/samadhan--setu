import React, { useState } from 'react';
import { SUPABASE_ADMIN_MIGRATION_SQL } from '../../data/adminMigrationSql';
import { PrimaryButton } from '../common/PrimaryButton';
import {
  Database,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  Key,
  Layers,
  Lock
} from 'lucide-react';

export const SqlMigrationViewer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_ADMIN_MIGRATION_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Supabase SQL Migration & RLS Security Rules
              </h2>
              <p className="text-xs text-slate-500">
                PostgreSQL schema, foreign keys, and Row-Level-Security policies restricting admin tables to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-teal-900 font-bold">is_admin = TRUE</code>.
              </p>
            </div>
          </div>

          <PrimaryButton
            variant={copied ? 'primary' : 'accent'}
            size="sm"
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
          </PrimaryButton>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Key className="w-3.5 h-3.5 text-teal-700" />
              <span>users.is_admin</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Boolean column indexed for microsecond RLS permission evaluation on every incoming API query.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>admin_actions</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Immutable audit ledger with database triggers preventing any UPDATE or DELETE operations.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>expert_applications</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tier 3 application queue with verified institutional email domain validation and ID proof attachments.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>flagged_verifications</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Automated Sybil alert logs for suspicious IP bursts, rapid submissions, and geographic voting mismatches.
            </p>
          </div>
        </div>
      </div>

      {/* Code Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              supabase/migrations/20260828000000_admin_oversight_rls.sql
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <pre className="p-4 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{SUPABASE_ADMIN_MIGRATION_SQL}</code>
        </pre>
      </div>
    </div>
  );
};
