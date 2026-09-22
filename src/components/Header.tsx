import React from 'react';
import { PassportCode, PassportOption } from '../types';
import { PASSPORT_OPTIONS, CURRENCY_RATES } from '../data/passports';
import { Bell, Compass, Bookmark, Video, ShieldCheck, Search, Globe, User, LogIn, LogOut } from 'lucide-react';
import { IjeoraLogo } from './IjeoraLogo';

interface HeaderProps {
  currentTab: 'home' | 'explore' | 'cango' | 'videos' | 'saved' | 'profile';
  setCurrentTab: (tab: 'home' | 'explore' | 'cango' | 'videos' | 'saved' | 'profile') => void;
  userPassport: PassportCode;
  setUserPassport: (code: PassportCode) => void;
  currency: string;
  setCurrency: (c: string) => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  onSearchClick: () => void;
  onOpenProfile?: () => void;
  firebaseConnected?: boolean;
  currentUser?: any;
  onOpenSignIn?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  userPassport,
  setUserPassport,
  currency,
  setCurrency,
  onOpenAlerts,
  unreadAlertsCount,
  onSearchClick,
  onOpenProfile,
  firebaseConnected,
  currentUser,
  onOpenSignIn,
  onSignOut,
}) => {
  const currentPassport = PASSPORT_OPTIONS.find((p) => p.code === userPassport) || PASSPORT_OPTIONS[0];
  const isUserSignedIn = currentUser && !currentUser.isAnonymous;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Taglines */}
          <div id="brand-logo-container" className="flex-shrink-0">
            <IjeoraLogo
              size="md"
              showText={true}
              interactive={true}
              onClick={() => setCurrentTab('home')}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-shrink-0">
            <button
              id="nav-tab-home"
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                currentTab === 'home'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Home Feed
            </button>
            <button
              id="nav-tab-cango"
              onClick={() => setCurrentTab('cango')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                currentTab === 'cango'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Can I Go?</span>
            </button>
            <button
              id="nav-tab-explore"
              onClick={() => setCurrentTab('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                currentTab === 'explore'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Explore</span>
            </button>
            <button
              id="nav-tab-videos"
              onClick={() => setCurrentTab('videos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                currentTab === 'videos'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>Shorts</span>
            </button>
            <button
              id="nav-tab-saved"
              onClick={() => setCurrentTab('saved')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                currentTab === 'saved'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Collections</span>
            </button>
          </nav>

          {/* User Controls: Passport, Currency, Alerts */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Quick Search Button */}
            <button
              id="btn-header-search"
              onClick={onSearchClick}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0"
              title="Search Destinations or Natural Queries"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Passport Selector Pill */}
            <div className="relative flex items-center flex-shrink-0">
              <label htmlFor="passport-select" className="sr-only">Passport</label>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap">
                <span className="text-sm select-none">{currentPassport.flag}</span>
                <span className="hidden xl:inline text-slate-400 font-normal">Passport:</span>
                <select
                  id="passport-select"
                  value={userPassport}
                  onChange={(e) => setUserPassport(e.target.value as PassportCode)}
                  className="bg-transparent text-xs font-semibold text-amber-300 focus:outline-none cursor-pointer pr-1"
                >
                  {PASSPORT_OPTIONS.map((p) => (
                    <option key={p.code} value={p.code} className="bg-slate-900 text-white">
                      {p.flag} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="relative hidden sm:flex items-center flex-shrink-0">
              <label htmlFor="currency-select" className="sr-only">Currency</label>
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 whitespace-nowrap">
                <Globe className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <select
                  id="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
                >
                  {Object.keys(CURRENCY_RATES).map((cur) => (
                    <option key={cur} value={cur} className="bg-slate-900 text-white">
                      {cur} ({CURRENCY_RATES[cur].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Alerts Button */}
            <button
              id="btn-header-alerts"
              onClick={onOpenAlerts}
              className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex-shrink-0"
              title="Travel Alerts & Policy Changes"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* User Authentication & Profile Buttons */}
            {isUserSignedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                {onOpenProfile && (
                  <button
                    id="btn-header-profile"
                    onClick={onOpenProfile}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold"
                    title="Traveller Profile & Settings"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                      {currentUser?.displayName 
                        ? currentUser.displayName.charAt(0).toUpperCase() 
                        : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
                    </div>
                    <span className="hidden xl:inline max-w-[100px] truncate text-slate-300">
                      {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Traveller'}
                    </span>
                    {firebaseConnected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Firebase Synchronized" />
                    )}
                  </button>
                )}

                {onSignOut && (
                  <button
                    id="btn-header-signout"
                    onClick={onSignOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-all text-xs font-semibold whitespace-nowrap"
                    title="Sign Out of IJEORA"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                {onOpenSignIn && (
                  <button
                    id="btn-header-signin"
                    onClick={onOpenSignIn}
                    className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm whitespace-nowrap"
                    title="Sign In to IJEORA"
                  >
                    <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Sign In</span>
                  </button>
                )}

                {onOpenProfile && (
                  <button
                    id="btn-header-profile"
                    onClick={onOpenProfile}
                    className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex-shrink-0 flex items-center gap-1.5"
                    title="Traveller Profile & Firebase Cloud Sync"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    {firebaseConnected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Firebase Synchronized" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
