import React from 'react';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';

interface VerifiedBadgeProps {
  type?: 'expert' | 'quorum' | 'general';
  expertName?: string;
  votesCount?: number;
  requiredVotes?: number;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  type = 'general',
  expertName,
  votesCount = 5,
  requiredVotes = 5,
  className = ''
}) => {
  return (
    <div
      id="verified-badge"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs tracking-tight ${className}`}
      title={
        type === 'expert'
          ? `Expert Approved by ${expertName || 'Credentialed Specialist'}`
          : type === 'quorum'
          ? `Community Quorum Met (${votesCount}/${requiredVotes} Verified Citizens)`
          : 'Community & Expert Verified'
      }
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
      <span>
        {type === 'expert'
          ? 'Expert Approved ✓'
          : type === 'quorum'
          ? `Quorum Verified (${votesCount}/${requiredVotes}) ✓`
          : 'Verified ✓'}
      </span>
    </div>
  );
};
