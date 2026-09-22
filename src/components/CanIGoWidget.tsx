import React, { useState } from 'react';
import { Destination, PassportCode } from '../types';
import { PASSPORT_OPTIONS } from '../data/passports';
import { ExternalLink, Sparkles } from 'lucide-react';
import { PracticalEntryPathwayView } from './PracticalEntryPathwayView';

interface CanIGoWidgetProps {
  destinations: Destination[];
  selectedPassport: PassportCode;
  onChangePassport: (code: PassportCode) => void;
  onSelectDestination: (dest: Destination) => void;
  currency: string;
}

export const CanIGoWidget: React.FC<CanIGoWidgetProps> = ({
  destinations,
  selectedPassport,
  onChangePassport,
  onSelectDestination,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || 'zanzibar');

  const currentPassport = PASSPORT_OPTIONS.find((p) => p.code === selectedPassport) || PASSPORT_OPTIONS[0];
  const currentDestination = destinations.find((d) => d.id === selectedDestId) || destinations[0];

  return (
    <div
      id="can-i-go-widget"
      className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 shadow-2xl p-5 sm:p-7 overflow-hidden"
    >
      {/* Subtle Ambient Light Beam (Brand aesthetic) */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Travel Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <span>Can I Go?</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              Demo Data • Verified Rules
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic passport evaluation: real documentation, fees, health protocols, and verified border reality.
          </p>
        </div>

        {/* Explore Full Destination Guide Button */}
        <button
          id="btn-widget-open-dest"
          onClick={() => onSelectDestination(currentDestination)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center gap-2"
        >
          <span>Deep Intelligence for {currentDestination.name}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selectors: Passport -> Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Passport Selector Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-colors">
          <label htmlFor="widget-passport" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            1. My Passport / Nationality
          </label>
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">{currentPassport.flag}</span>
            <select
              id="widget-passport"
              value={selectedPassport}
              onChange={(e) => onChangePassport(e.target.value as PassportCode)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              {PASSPORT_OPTIONS.map((p) => (
                <option key={p.code} value={p.code} className="bg-slate-900 text-white">
                  {p.flag} {p.name} ({p.demonym})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination Selector Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-colors">
          <label htmlFor="widget-destination" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            2. Where I am Travelling To
          </label>
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">{currentDestination.flag}</span>
            <select
              id="widget-destination"
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <optgroup label="🇳🇬 Nigeria Domestic Destinations" className="bg-slate-900 font-bold text-emerald-400">
                {destinations
                  .filter((d) => d.isDomestic)
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.name} ({d.stateOrProvince || 'Nigeria'})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌍 Africa" className="bg-slate-900 font-bold text-amber-400">
                {destinations
                  .filter((d) => !d.isDomestic && d.region === 'Africa')
                  .sort((a, b) => a.country.localeCompare(b.country))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.country} {d.name !== d.country ? `(${d.name})` : ''} {!d.hasLiveIntel ? '• [Live Pending]' : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🇪🇺 Europe" className="bg-slate-900 font-bold text-sky-400">
                {destinations
                  .filter((d) => !d.isDomestic && d.region === 'Europe')
                  .sort((a, b) => a.country.localeCompare(b.country))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.country} {d.name !== d.country ? `(${d.name})` : ''} {!d.hasLiveIntel ? '• [Live Pending]' : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌏 Asia" className="bg-slate-900 font-bold text-indigo-400">
                {destinations
                  .filter((d) => !d.isDomestic && d.region === 'Asia')
                  .sort((a, b) => a.country.localeCompare(b.country))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.country} {d.name !== d.country ? `(${d.name})` : ''} {!d.hasLiveIntel ? '• [Live Pending]' : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌎 Americas (North, Central, South)" className="bg-slate-900 font-bold text-teal-400">
                {destinations
                  .filter((d) => !d.isDomestic && ['North America', 'South America', 'Central America'].includes(d.region))
                  .sort((a, b) => a.country.localeCompare(b.country))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.country} ({d.region}) {!d.hasLiveIntel ? '• [Live Pending]' : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🏜️ Middle East" className="bg-slate-900 font-bold text-amber-300">
                {destinations
                  .filter((d) => !d.isDomestic && d.region === 'Middle East')
                  .sort((a, b) => a.country.localeCompare(b.country))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.country} {!d.hasLiveIntel ? '• [Live Pending]' : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌴 Caribbean & Indian Ocean" className="bg-slate-900 font-bold text-emerald-300">
                {destinations
                  .filter((d) => !d.isDomestic && ['Caribbean', 'Indian Ocean'].includes(d.region))
                  .sort((a, b) => a.country.localeCompare(b.country))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.country} {d.name !== d.country ? `(${d.name})` : ''} {!d.hasLiveIntel ? '• [Live Pending]' : ''}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌊 Oceania" className="bg-slate-900 font-bold text-blue-300">
                {destinations
                  .filter((d) => !d.isDomestic && d.region === 'Oceania')
                  .sort((a, b) => a.country.localeCompare(b.country))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-normal">
                      {d.flag} {d.country} {!d.hasLiveIntel ? '• [Live Pending]' : ''}
                    </option>
                  ))}
              </optgroup>
              </select>
          </div>
        </div>
      </div>

      {/* Practical Entry Pathway Engine View */}
      <PracticalEntryPathwayView
        destination={currentDestination}
        passportCode={selectedPassport}
        showAllQuestionsDefault={false}
        onOpenReportModal={() => onSelectDestination(currentDestination)}
      />
    </div>
  );
};
