import React from 'react';
import { TravelAlert, TrustLevel } from '../types';
import { TrustBadge } from './TrustBadge';
import { X, Bell, AlertTriangle, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface TravelAlertsModalProps {
  alerts: TravelAlert[];
  onClose: () => void;
  followedDestinationIds: string[];
  onToggleFollowDestination?: (destId: string) => void;
}

export const TravelAlertsModal: React.FC<TravelAlertsModalProps> = ({
  alerts,
  onClose,
  followedDestinationIds,
  onToggleFollowDestination,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Active Travel Alerts</h3>
              <p className="text-xs text-slate-400">
                Verified immigration policy changes, health mandates, and airport notices.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5">
          {alerts.map((alt) => {
            const isFollowed = alt.destinationId && followedDestinationIds.includes(alt.destinationId);

            return (
              <div
                key={alt.id}
                className={`p-4 rounded-2xl border transition-all ${
                  alt.isUrgent
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{alt.flag}</span>
                    <strong className="text-sm text-white">
                      {alt.destinationName}, {alt.country}
                    </strong>
                    <TrustBadge level={alt.trustLevel} />
                  </div>

                  <span className="text-[11px] text-slate-500">{alt.timestamp}</span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-amber-200 mt-2.5">{alt.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{alt.summary}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">Source: {alt.source}</span>

                  {alt.destinationId && onToggleFollowDestination && (
                    <button
                      onClick={() => onToggleFollowDestination(alt.destinationId!)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                        isFollowed
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {isFollowed ? 'Following Updates' : '+ Follow Destination'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          IJEORA alerts are cross-verified with official gazettes and trusted on-the-ground partners.
        </div>
      </div>
    </div>
  );
};
