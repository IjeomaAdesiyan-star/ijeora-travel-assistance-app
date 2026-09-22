import React, { useState } from 'react';
import ijeoraLogoImg from '../assets/images/ijeora_app_logo_1790004110867.jpg';
import { Sparkles, Compass, Shield, Feather, X, Check, Copy } from 'lucide-react';

interface IjeoraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const IjeoraLogo: React.FC<IjeoraLogoProps> = ({
  size = 'md',
  showText = true,
  interactive = true,
  className = '',
  onClick,
}) => {
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [glowMode, setGlowMode] = useState<'gold' | 'emerald' | 'eclipse'>('gold');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const sizeClasses = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-28 h-28 rounded-3xl',
  };

  const glowStyles = {
    gold: 'shadow-[0_0_25px_rgba(245,158,11,0.45)] border-amber-400/50',
    emerald: 'shadow-[0_0_25px_rgba(16,185,129,0.5)] border-emerald-400/50',
    eclipse: 'shadow-[0_0_30px_rgba(217,119,6,0.6)] border-amber-300/70',
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <>
      <div
        className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}
        onClick={onClick}
      >
        {/* Hypnotic Addictive Emblem Container */}
        <div className="relative flex-shrink-0">
          {/* Ambient Breathing Radiance */}
          <div
            className={`absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 blur-md transition-all duration-700 ${
              glowMode === 'emerald'
                ? 'bg-gradient-to-r from-emerald-500/40 via-teal-400/30 to-amber-500/40'
                : 'bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-emerald-500/30'
            }`}
          />

          {/* Concentric Magnetic Ring */}
          <div
            className={`relative ${sizeClasses[size]} overflow-hidden p-[2px] bg-gradient-to-br from-amber-300/60 via-slate-900 to-emerald-500/40 border transition-all duration-500 transform group-hover:scale-105 ${glowStyles[glowMode]}`}
          >
            {/* Inner Shimmer Reflection Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* The Generated World-Class Custom Ijeora Emblem */}
            <img
              src={ijeoraLogoImg}
              alt="Ijeora - Celestial Voyaging Falcon & Horizon Compass Emblem"
              className="w-full h-full object-cover object-center rounded-[inherit] transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />

            {/* Micro Star Flare */}
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_#fde68a] pointer-events-none opacity-80 group-hover:opacity-100 animate-pulse" />
          </div>
        </div>

        {/* Optional Brand Typography */}
        {showText && (
          <div className="flex flex-col flex-shrink-0 min-w-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-black text-2xl sm:text-[26px] tracking-tight leading-none text-white font-['Plus_Jakarta_Sans'] group-hover:text-amber-200 transition-colors flex items-center">
                IJEORA
              </span>
              {/* Addictive interactive DNA badge */}
              {interactive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStoryModal(true);
                  }}
                  title="Discover the Ijeora Emblem Lore & Secret Design"
                  className="px-1.5 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 text-[10px] font-bold text-amber-300 flex items-center gap-1 transition-all hover:scale-105 whitespace-nowrap"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">Emblem DNA</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap mt-0.5">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-400 uppercase leading-none">
                Know Before You Go.
              </span>
              <span className="hidden xl:inline-block text-[10px] text-emerald-400 font-medium leading-none">
                • Verified Intel
              </span>
            </div>
          </div>
        )}
      </div>

      {/* The Addictive Logo Lore & Anatomy Modal */}
      {showStoryModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowStoryModal(false)}
        >
          <div
            className="relative w-full max-w-xl bg-slate-900/95 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/70 space-y-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Emblem Display */}
            <div className="text-center space-y-3">
              <div className="inline-block relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/30 via-emerald-500/20 to-amber-500/30 blur-xl animate-pulse" />
                <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-amber-600 to-emerald-400 shadow-2xl overflow-hidden mx-auto ${glowStyles[glowMode]}`}>
                  <img
                    src={ijeoraLogoImg}
                    alt="Ijeora Brand Emblem"
                    className="w-full h-full object-cover rounded-[22px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  The IJEORA Emblem
                </h3>
                <p className="text-xs text-amber-300 font-semibold tracking-wide uppercase mt-0.5">
                  The Celestial Falcon & Perpetual Horizon Compass
                </p>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  No other travel app looks like this. While other platforms use generic map pins or airplane vectors, IJEORA fuses ancient voyager symbolism with futuristic borderless intelligence.
                </p>
              </div>
            </div>

            {/* Interactive Glow Switcher */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300">Emblem Aura:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setGlowMode('gold')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    glowMode === 'gold'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  ☀️ Molten Gold
                </button>
                <button
                  onClick={() => setGlowMode('emerald')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    glowMode === 'emerald'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🌿 African Aurora
                </button>
                <button
                  onClick={() => setGlowMode('eclipse')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    glowMode === 'eclipse'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🌌 Horizon Eclipse
                </button>
              </div>
            </div>

            {/* Design Anatomy Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Anatomy of the Symbol
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <Feather className="w-3.5 h-3.5" />
                    <span>The Falcon Wing (&quot;Ije&quot;)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    In Igbo lore, &quot;Ije&quot; is the voyage. The aerodynamic curved feather blade represents migratory freedom that transcends bureaucratic walls.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>The Solar Core (&quot;Ọra&quot;)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    &quot;Ọra&quot; is the people, the community, and the sun. The blazing star at center represents travel truth and shared intelligence.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>The Emerald Meridian</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Honoring the green passport and Africa&apos;s lush biodiversity. Turns immigration anxiety into verified confidence.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-200 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Möbius Horizon Loop</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    A continuous infinite loop with no dead-ends: every departure leads to homecoming and discovery.
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Color Swatches */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Brand Palette Tokens (Click to Copy)
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                {[
                  { name: 'Zenith Gold', hex: '#F59E0B', bg: 'bg-[#F59E0B]' },
                  { name: 'Aurora Green', hex: '#10B981', bg: 'bg-[#10B981]' },
                  { name: 'Solar Core', hex: '#FBBF24', bg: 'bg-[#FBBF24]' },
                  { name: 'Obsidian Velvet', hex: '#020617', bg: 'bg-[#020617]' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleCopyColor(color.hex)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all text-left flex flex-col items-center gap-1 group"
                  >
                    <div className={`w-full h-6 rounded-lg ${color.bg} border border-white/20 shadow-inner`} />
                    <span className="text-[9px] text-slate-400 font-sans truncate w-full text-center">
                      {color.name}
                    </span>
                    <span className="text-[10px] text-slate-200 group-hover:text-amber-300 flex items-center gap-1">
                      {copiedColor === color.hex ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-slate-500" />}
                      {color.hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowStoryModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Return to Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
