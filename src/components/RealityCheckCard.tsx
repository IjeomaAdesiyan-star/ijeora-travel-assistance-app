import React, { useState } from 'react';
import { RealityCheckItem } from '../types';
import { ShieldCheck, Users, ThumbsUp, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { TrustBadge } from './TrustBadge';

interface RealityCheckCardProps {
  item: RealityCheckItem;
  onReportMisinformation?: (item: RealityCheckItem) => void;
}

export const RealityCheckCard: React.FC<RealityCheckCardProps> = ({ item, onReportMisinformation }) => {
  const [upvotes, setUpvotes] = useState(item.reportCount);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  return (
    <div
      id={`reality-check-${item.id}`}
      className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl overflow-hidden transition-all hover:border-slate-700"
    >
      {/* Header bar with Trust Contrast badges */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Reality Check
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{item.topic}</h3>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            {item.confidenceRating}% Confidence
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Side-by-Side or Stacked Visual Separation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: OFFICIAL REQUIREMENT */}
            <div className="rounded-xl bg-slate-950/80 border border-emerald-500/20 p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Official Requirement</span>
                  </div>
                  <TrustBadge level="OFFICIAL" showLabel={false} />
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {item.officialPolicy}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-500">Authority Source:</span>{' '}
                <span className="text-slate-300 font-medium">{item.officialSource}</span>
              </div>
            </div>

            {/* Box 2: TRAVELLER REALITY */}
            <div className="rounded-xl bg-slate-950/80 border border-amber-500/30 p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Traveller Reality</span>
                  </div>
                  <TrustBadge level="COMMUNITY" showLabel={false} />
                </div>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-normal">
                  {item.travellerReality}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Reported by:</span>{' '}
                  <span className="text-slate-300 font-medium">{item.communitySource}</span>
                </div>
                <span className="text-slate-500">{item.lastReportedDate}</span>
              </div>
            </div>
          </div>

          {/* Action Footer: Helpful validation & Misinformation reporting */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpvote}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                  hasUpvoted
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful to {upvotes} travellers</span>
              </button>
            </div>

            {onReportMisinformation && (
              <button
                onClick={() => onReportMisinformation(item)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                title="Report inaccurate information or border change"
              >
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Report inaccurate info</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
