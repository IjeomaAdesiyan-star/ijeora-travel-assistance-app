import React from 'react';
import { PassportCode, UserPreferences } from '../types';
import { PASSPORT_OPTIONS, CURRENCY_RATES } from '../data/passports';
import { X, User, Globe, Plane, ShieldCheck, Heart, Sparkles, Check, LogIn, LogOut, KeyRound } from 'lucide-react';

interface UserProfileModalProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onClose: () => void;
  followedCount: number;
  savedCount: number;
  currentUser?: any;
  onOpenSignIn?: () => void;
  onSignOut?: () => void;
}

const TRAVEL_STYLES = [
  'Beaches & Islands',
  'African Safari & Wildlife',
  'Rich History & Culture',
  'Global Food & Street Gastronomy',
  'Luxury Resorts & Spas',
  'Budget & Backpacker',
  'Nightlife & Music Festivals',
  'Solo Adventure & Exploration',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  preferences,
  onUpdatePreferences,
  onClose,
  followedCount,
  savedCount,
  currentUser,
  onOpenSignIn,
  onSignOut,
}) => {
  const toggleStyle = (style: string) => {
    const current = preferences.travelStyle || [];
    if (current.includes(style)) {
      onUpdatePreferences({ travelStyle: current.filter((s) => s !== style) });
    } else {
      onUpdatePreferences({ travelStyle: [...current, style] });
    }
  };

  const isUserSignedIn = currentUser && !currentUser.isAnonymous;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-lg">
              {currentUser?.displayName 
                ? currentUser.displayName.charAt(0).toUpperCase() 
                : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : (preferences.name ? preferences.name.charAt(0).toUpperCase() : 'T'))}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Traveller Intelligence Profile</h3>
              <p className="text-xs text-slate-400">
                Personalized entry checks, departure hubs, and curated possibilities.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs sm:text-sm">
          {/* Account Authentication Card */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isUserSignedIn ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isUserSignedIn ? <Check className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {isUserSignedIn 
                        ? (currentUser.displayName || currentUser.email) 
                        : 'Guest Explorer Mode'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                      isUserSignedIn 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {isUserSignedIn ? 'Authenticated' : 'Guest'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isUserSignedIn 
                      ? (currentUser.email ? `Account: ${currentUser.email}` : 'Signed in via Google') 
                      : 'Sign in to access your saved destinations across all your browsers and devices.'}
                  </p>
                </div>
              </div>

              {/* Action: Sign In or Sign Out */}
              <div>
                {isUserSignedIn ? (
                  <button
                    id="btn-profile-signout"
                    type="button"
                    onClick={onSignOut}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    id="btn-profile-signin"
                    type="button"
                    onClick={onOpenSignIn}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div>
              <span className="text-xs text-slate-400 block">Saved Destinations</span>
              <strong className="text-lg font-bold text-amber-300">{savedCount}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Followed Alerts</span>
              <strong className="text-lg font-bold text-sky-300">{followedCount}</strong>
            </div>
          </div>

          {/* Primary Passport Configuration */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <label className="block font-semibold text-white">Primary Passport / Nationality</label>
            <p className="text-xs text-slate-400">
              All "Can I Go?" visa calculations will default to this nationality.
            </p>
            <select
              value={preferences.primaryPassport}
              onChange={(e) => onUpdatePreferences({ primaryPassport: e.target.value as PassportCode })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {PASSPORT_OPTIONS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.flag} {p.name} ({p.demonym})
                </option>
              ))}
            </select>
          </div>

          {/* Departure Hub & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <label className="block font-semibold text-white">Home Departure Hub</label>
              <input
                type="text"
                value={preferences.homeAirport}
                onChange={(e) => onUpdatePreferences({ homeAirport: e.target.value })}
                placeholder="e.g. LOS (Lagos), NBO (Nairobi), LHR (London)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <label className="block font-semibold text-white">Display Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => onUpdatePreferences({ currency: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {Object.keys(CURRENCY_RATES).map((cur) => (
                  <option key={cur} value={cur}>
                    {cur} ({CURRENCY_RATES[cur].symbol}) - {CURRENCY_RATES[cur].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Travel Style Pills */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <label className="block font-semibold text-white">Travel Style & Passions</label>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((style) => {
                const active = preferences.travelStyle?.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      active
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{style}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Firebase Cloud Sync Status */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-xs">Firebase Cloud Persistence</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>
                <strong className="text-slate-300">Project ID:</strong>{' '}
                <span className="font-mono text-amber-300">ijeora-travel-assistance-app</span>
              </p>
              <p>
                Your saved destinations, passports, currency selection, and travel preferences automatically synchronize across sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
