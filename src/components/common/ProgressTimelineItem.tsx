import React from 'react';
import { ProgressUpdate } from '../../types';
import { TierBadge } from './TierBadge';
import { MapPin, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';

interface ProgressTimelineItemProps {
  update: ProgressUpdate;
  isLast?: boolean;
}

const STAGE_CONFIG: Record<ProgressUpdate['stage'], { label: string; color: string; bg: string }> = {
  survey: { label: 'Site Survey & Clearance', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-300' },
  procurement: { label: 'Material Procurement', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300' },
  groundwork: { label: 'Civil Groundwork & Assembly', color: 'text-purple-700', bg: 'bg-purple-100 border-purple-300' },
  piloted: { label: 'Pilot Testing & Calibration', color: 'text-teal-700', bg: 'bg-teal-100 border-teal-300' },
  completed: { label: 'Work Completed & Commissioned', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-300' }
};

export const ProgressTimelineItem: React.FC<ProgressTimelineItemProps> = ({ update, isLast = false }) => {
  const stage = STAGE_CONFIG[update.stage] || STAGE_CONFIG.survey;

  return (
    <div className="relative flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${stage.bg}`}>
          <CheckCircle2 className={`w-4 h-4 ${stage.color}`} />
        </div>
        {!isLast && <div className="w-0.5 grow bg-slate-200 my-1" />}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${stage.bg} ${stage.color}`}>
                {stage.label}
              </span>
              {update.verifiedByQuorum && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Geo-Verified Proof
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{update.date}</span>
            </div>
          </div>

          {/* Title & Description */}
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {update.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {update.description}
          </p>

          {/* Photo Proof with Watermark & Geo-tag */}
          {update.photoProofUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <img
                src={update.photoProofUrl}
                alt={update.title}
                className="w-full h-48 sm:h-56 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 text-white">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">{update.geoTag.locationName}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
                    {update.geoTag.lat.toFixed(4)}°N, {update.geoTag.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Author info */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <img
                src={update.author.avatar}
                alt={update.author.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <span className="font-semibold text-slate-800">{update.author.name}</span>
              <span className="text-slate-400">({update.author.roleTitle})</span>
            </div>
            <TierBadge tier={update.author.tier} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
