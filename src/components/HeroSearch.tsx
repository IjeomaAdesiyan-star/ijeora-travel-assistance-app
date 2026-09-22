import React, { useState } from 'react';
import { Search, Sparkles, X, Filter } from 'lucide-react';
import { PassportCode } from '../types';
import { PASSPORT_OPTIONS } from '../data/passports';
import { IjeoraLogo } from './IjeoraLogo';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPassport: PassportCode;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  onQuickPrompt: (prompt: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const SAMPLE_PROMPTS = [
  'Can Nigerians visit Mauritius?',
  'Where should I visit in Nigeria?',
  'Weekend trips from Abuja',
  'Requirements for Japan',
  'Can I visit Brazil or Peru?',
  'Visa-free countries for green passport',
  'Affordable getaways from Lagos',
  'Explore Kenya or Rwanda',
];

const CATEGORY_CHIPS = [
  'All',
  '🇳🇬 Nigeria Domestic',
  'Weekend from Abuja',
  'Getaways from Lagos',
  'Waterfalls & Springs',
  'Mountains & Hiking',
  'Beaches & Islands',
  'Wildlife & Safari',
  'Rich Culture',
  'Gastronomy & Food',
  'Visa-Free Escapes',
  'Hidden Gems',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedPassport,
  selectedFilter,
  setSelectedFilter,
  onQuickPrompt,
  activeCategory,
  setActiveCategory,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const passportName = PASSPORT_OPTIONS.find((p) => p.code === selectedPassport)?.name || 'Nigeria';

  return (
    <div id="hero-search-section" className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Light Horizon glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[220px] bg-gradient-to-r from-amber-500/15 via-sky-500/10 to-amber-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Centered Addictive Ijeora Emblem */}
      <div className="flex justify-center mb-3">
        <IjeoraLogo size="lg" showText={false} interactive={true} />
      </div>

      {/* Brand Sub-header */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-4 backdrop-blur-md shadow-lg shadow-amber-500/5">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span className="font-bold tracking-wide">GLOBAL TRAVEL INTELLIGENCE</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300 font-normal">Evaluating for {passportName} Passport</span>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-['Plus_Jakarta_Sans']">
        Understand Before You Book.
      </h1>

      <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
        The discovery and intelligence platform illuminating real entry rules, confirmed fees, transit constraints, and verified on-the-ground reality.
      </p>

      {/* Search Input Bar */}
      <div className="mt-7 max-w-2xl mx-auto relative group">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/30 via-sky-500/20 to-amber-500/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-amber-400 transition-colors">
          <div className="p-3 text-slate-400">
            <Search className="w-5 h-5 text-amber-400" />
          </div>

          <input
            id="input-global-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any country or destination worldwide (e.g. Kenya, France, Brazil, Japan, Ghana, Peru, Fiji, Nigeria)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none pr-2"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFilters || selectedFilter !== 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Global Database Non-Negotiable Indicator */}
        <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Complete Global Database: All 195+ sovereign countries & territories indexed worldwide</span>
        </div>
      </div>

      {/* Expanded Filters Drawer */}
      {showFilters && (
        <div className="mt-3 max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in shadow-xl">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Visa Requirement</label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 cursor-pointer"
            >
              <option value="all">All Visa Types</option>
              <option value="domestic">Domestic Travel (No Visa Required)</option>
              <option value="visa-free">Visa-Free Only</option>
              <option value="voa-evisa">Visa on Arrival / eVisa</option>
              <option value="visa-required">Visa Required</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Budget Expectation</label>
            <select
              onChange={(e) => {
                if (e.target.value) setSearchQuery(e.target.value);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 cursor-pointer"
            >
              <option value="">Any Budget</option>
              <option value="budget">Backpacker (&lt;$70/day)</option>
              <option value="moderate">Comfort ($100-$250/day)</option>
              <option value="luxury">Luxury ($350+/day)</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-end">
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchQuery('');
                setShowFilters(false);
              }}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Suggested Natural Language Prompts */}
      <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Try:</span>
        </span>
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(prompt)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800/80 hover:border-amber-500/40 transition-colors"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Category Pills Bar */}
      <div className="mt-8 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full px-2">
        {CATEGORY_CHIPS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
