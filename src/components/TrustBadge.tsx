import React from 'react';
import { TrustLevel } from '../types';
import { ShieldCheck, CheckCircle2, Handshake, Users } from 'lucide-react';

interface TrustBadgeProps {
  level: TrustLevel;
  className?: string;
  showLabel?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ level, className = '', showLabel = true }) => {
  switch (level) {
    case 'OFFICIAL':
      return (
        <span
          id={`trust-badge-${level.toLowerCase()}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 ${className}`}
          title="Official Government, Immigration or Embassy Authority Source"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {showLabel && <span>OFFICIAL</span>}
        </span>
      );
    case 'VERIFIED':
      return (
        <span
          id={`trust-badge-${level.toLowerCase()}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-sky-950/80 text-sky-300 border border-sky-500/30 ${className}`}
          title="Verified by IJEORA Travel Intelligence Team"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          {showLabel && <span>VERIFIED</span>}
        </span>
      );
    case 'PARTNER':
      return (
        <span
          id={`trust-badge-${level.toLowerCase()}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 ${className}`}
          title="Supplied by Trusted Destination Partner"
        >
          <Handshake className="w-3.5 h-3.5 text-indigo-400" />
          {showLabel && <span>PARTNER</span>}
        </span>
      );
    case 'COMMUNITY':
      return (
        <span
          id={`trust-badge-${level.toLowerCase()}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-amber-950/80 text-amber-300 border border-amber-500/30 ${className}`}
          title="Community Report — Real Traveller Experience"
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          {showLabel && <span>COMMUNITY</span>}
        </span>
      );
    default:
      return null;
  }
};
