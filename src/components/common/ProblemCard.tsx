import React from 'react';
import { Problem } from '../../types';
import { StatusPill } from './StatusPill';
import { DomainTag } from './DomainTag';
import { TierBadge } from './TierBadge';
import { MapPin, Users, ThumbsUp, MessageSquare, Lightbulb, ChevronRight, ShieldCheck } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  onClick: () => void;
  onUpvote?: (e: React.MouseEvent) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onClick, onUpvote }) => {
  return (
    <div
      id={`problem-card-${problem.id}`}
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-600/60 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Meta: Domain & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <DomainTag domain={problem.domain} size="sm" />
          <StatusPill status={problem.status} size="sm" />
        </div>

        {/* Thumbnail & Title Layout */}
        <div className="flex gap-3.5 items-start">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
            <img
              src={problem.photoUrl}
              alt={problem.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {problem.duplicatesCount > 0 && (
              <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                +{problem.duplicatesCount} joined
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-900 line-clamp-2 leading-snug">
              {problem.title}
            </h3>
            <p className="text-xs text-slate-500 font-hindi line-clamp-1 mt-0.5">
              {problem.titleHindi}
            </p>

            <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 flex-wrap">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                {problem.block}, {problem.district}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                <Users className="w-3 h-3 text-slate-500" />
                <strong className="text-slate-800">{problem.affectedCount.toLocaleString()}</strong> affected
              </span>
            </div>
          </div>
        </div>

        {/* Implementer claim indicator if present */}
        {problem.claimedBy && (
          <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-teal-50/90 border border-teal-200/70 flex items-center justify-between text-xs text-teal-900">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              Claimed by: {problem.claimedBy.name}
            </span>
            <span className="text-[11px] text-teal-700 font-medium capitalize">
              ({problem.claimedBy.type})
            </span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote?.(e);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              problem.hasUpvoted
                ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${problem.hasUpvoted ? 'fill-teal-700 text-teal-700' : ''}`} />
            <span>{problem.upvotes}</span>
          </button>

          <span className="inline-flex items-center gap-1 text-slate-600">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            {problem.commentsCount}
          </span>

          <span className="inline-flex items-center gap-1 text-slate-600">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            {problem.proposalsCount} solutions
          </span>
        </div>

        <div className="flex items-center gap-1 text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>Details</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
