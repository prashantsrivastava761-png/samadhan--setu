import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'table' | 'detail' | 'list';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type = 'card', count = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
            <div className="w-20 h-6 bg-slate-200 rounded-full" />
          </div>
          <div className="h-48 bg-slate-100 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-4/5" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-8 bg-slate-200 rounded-lg w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};
