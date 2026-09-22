import React from 'react';
import { Destination, PassportCode } from '../types';
import { formatCurrency } from '../data/passports';
import { TrustBadge } from './TrustBadge';
import { Bookmark, ShieldCheck, Compass, Sparkles, MapPin } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  userPassport: PassportCode;
  onSelect: (dest: Destination) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  currency: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  userPassport,
  onSelect,
  isSaved,
  onToggleSave,
  currency,
}) => {
  const rule = destination.entryRulesByPassport[userPassport] || {
    status: 'Visa Required',
    feeEstimateUSD: 80,
    trustLevel: 'OFFICIAL',
  };

  const getStatusBadge = () => {
    switch (rule.status) {
      case 'Domestic / Citizen':
        return 'bg-emerald-900/90 text-emerald-200 border-emerald-400/50 shadow-emerald-950/50';
      case 'Visa-Free':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Visa on Arrival':
        return 'bg-sky-950/80 text-sky-300 border-sky-500/40';
      case 'eVisa':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40';
      case 'eTA':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'Visa Required':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const topReality = destination.realityChecks[0];

  return (
    <div
      id={`card-destination-${destination.id}`}
      onClick={() => onSelect(destination)}
      className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image Section */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Ambient Gradient to protect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />

        {/* Floating Top Bar */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-start justify-between z-10 pointer-events-none gap-2">
          {/* Dynamic Visa Status Pill for User Passport - Single row to avoid downward overlap */}
          <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden max-w-[80%]">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md border shadow-md flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${getStatusBadge()}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{rule.status === 'Domestic / Citizen' ? 'Domestic (No Visa)' : rule.status}</span>
            </span>
            {destination.hasLiveIntel === false && (
              <span className="text-[10px] text-amber-300 font-bold bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-full border border-amber-500/40 whitespace-nowrap flex-shrink-0 hidden sm:inline-block">
                Live pending
              </span>
            )}
            <span className="text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 hidden md:inline-block whitespace-nowrap flex-shrink-0">
              {rule.status === 'Domestic / Citizen' ? 'Citizen Right' : `for ${userPassport}`}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(destination.id);
            }}
            className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md border transition-all flex-shrink-0 ${
              isSaved
                ? 'bg-amber-500 text-slate-950 border-amber-400 scale-110 shadow-lg'
                : 'bg-slate-950/70 text-white border-white/20 hover:bg-slate-900 hover:scale-105'
            }`}
            title={isSaved ? 'Saved in collection' : 'Save to collection'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay: Title & Country */}
        <div className="absolute bottom-3.5 inset-x-3.5 z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium drop-shadow mb-1 flex-wrap">
            <span className="text-lg select-none">{destination.flag}</span>
            <span className="font-semibold text-white">{destination.country}</span>
            {destination.stateOrProvince ? (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-300 font-semibold">{destination.stateOrProvince}</span>
              </>
            ) : (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300">{destination.region}</span>
              </>
            )}
            {destination.getawayFrom && destination.getawayFrom.length > 0 && (
              <span className="bg-slate-950/80 px-2 py-0.5 rounded-md text-[10px] text-amber-300 border border-white/10 hidden sm:inline-block whitespace-nowrap">
                Getaway from {destination.getawayFrom[0]}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Body Card Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {destination.overview}
        </p>

        {/* Reality Check Sneak Peek */}
        {topReality && (
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs">
            <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-amber-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>REALITY CHECK: {topReality.topic}</span>
              </span>
              <TrustBadge level={topReality.trustLevel || 'COMMUNITY'} showLabel={false} />
            </div>
            <p className="text-slate-300 text-[11px] line-clamp-2">
              <strong className="text-slate-200">Official:</strong> {topReality.officialPolicy.slice(0, 55)}...{' '}
              <strong className="text-amber-300">Reality:</strong> {topReality.travellerReality.slice(0, 65)}...
            </p>
          </div>
        )}

        {/* Card Footer: Cost & Action */}
        <div className="pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Daily Cost Estimate</span>
            <span className="text-sm font-bold text-white">
              ~{formatCurrency(destination.dailyBudgetEstimateUSD.moderate, currency)}
              <span className="text-slate-500 font-normal text-xs"> / day</span>
            </span>
          </div>

          <button
            onClick={() => onSelect(destination)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold transition-all border border-amber-500/30 hover:border-amber-500"
          >
            <span>Intelligence</span>
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
