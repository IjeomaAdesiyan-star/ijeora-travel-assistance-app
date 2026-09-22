import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Clock, 
  DollarSign, 
  HelpCircle, 
  Globe2, 
  ShieldCheck, 
  Plane, 
  Hotel, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  ExternalLink,
  Users,
  AlertCircle,
  FileCheck2,
  Stethoscope,
  Compass,
  CalendarCheck
} from 'lucide-react';
import { Destination, PassportCode, TravelPurpose, TrustLevel, RealityCheckItem } from '../types';
import { resolvePracticalEntryPathway, PracticalPathway14Questions } from '../utils/entryIntelligence';
import { TrustBadge } from './TrustBadge';
import { PASSPORT_OPTIONS } from '../data/passports';

interface PracticalEntryPathwayViewProps {
  destination: Destination;
  passportCode: PassportCode;
  initialPurpose?: TravelPurpose;
  showAllQuestionsDefault?: boolean;
  onOpenReportModal?: () => void;
}

const TRANSIT_OPTIONS = [
  { id: 'direct', label: 'Direct Flight (Non-stop)', notes: 'No international transit visa required.' },
  { id: 'add', label: 'Via Addis Ababa (ADD) — Ethiopian Airlines', notes: 'Airside transit under 24h is visa-free. Transit hotel provided for layovers >8h.' },
  { id: 'doh', label: 'Via Doha (DOH) — Qatar Airways', notes: 'Airside transit up to 24h does not require a transit visa. Do not exit terminal.' },
  { id: 'dxb', label: 'Via Dubai (DXB) — Emirates', notes: 'Airside transit up to 24h visa-free. Separate baggage re-check requires UAE transit visa.' },
  { id: 'nbo', label: 'Via Nairobi (NBO) — Kenya Airways', notes: 'Airside international transit does not require Kenya eTA if staying in terminal.' },
  { id: 'cdg', label: 'Via Paris (CDG) — Air France', notes: 'Nigerian/Ghanaian passport holders may require an Airport Transit Visa (DATV) unless holding valid US/UK/Schengen visa.' },
];

export const PracticalEntryPathwayView: React.FC<PracticalEntryPathwayViewProps> = ({
  destination,
  passportCode,
  initialPurpose = 'Tourism / Leisure',
  showAllQuestionsDefault = false,
  onOpenReportModal,
}) => {
  const [purpose, setPurpose] = useState<TravelPurpose>(initialPurpose);
  const [selectedTransit, setSelectedTransit] = useState<string>('direct');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(showAllQuestionsDefault ? 1 : null);
  const [activeSubView, setActiveSubView] = useState<'pathway' | 'matrix' | 'reality_check' | 'checklist'>('pathway');
  const [completedDocs, setCompletedDocs] = useState<Record<string, boolean>>({});

  const passport = useMemo(
    () => PASSPORT_OPTIONS.find((p) => p.code === passportCode) || PASSPORT_OPTIONS[0],
    [passportCode]
  );

  const pathway: PracticalPathway14Questions = useMemo(() => {
    return resolvePracticalEntryPathway(destination, passportCode, purpose);
  }, [destination, passportCode, purpose]);

  const selectedTransitInfo = useMemo(() => {
    return TRANSIT_OPTIONS.find((t) => t.id === selectedTransit) || TRANSIT_OPTIONS[0];
  }, [selectedTransit]);

  // Questions configuration for the 14 practical questions
  const questionsList = [
    {
      num: 1,
      q: 'Can I enter?',
      ans: pathway.canIEnter.headline,
      detail: pathway.canIEnter.practicalSummary,
      icon: CheckCircle2,
      badgeColor: pathway.canIEnter.verdict === 'YES' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : pathway.canIEnter.verdict === 'CONDITIONALLY' ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' : 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
    {
      num: 2,
      q: 'Do I need a visa?',
      ans: pathway.doINeedAVisa.statusText,
      detail: pathway.doINeedAVisa.explanation,
      icon: FileText,
      badgeColor: pathway.doINeedAVisa.isExempt ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      num: 3,
      q: 'Do I need an ETA/eTA or other pre-travel authorisation?',
      ans: pathway.doINeedAnETA.required ? `Required: ${pathway.doINeedAnETA.systemName}` : 'Not Required',
      detail: pathway.doINeedAnETA.explanation,
      subDetail: pathway.doINeedAnETA.required ? `Lead time: ${pathway.doINeedAnETA.leadTime} • Fee: $${pathway.doINeedAnETA.feeUSD} USD` : undefined,
      icon: Sparkles,
      badgeColor: pathway.doINeedAnETA.required ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30' : 'text-slate-400 bg-slate-800/40 border-slate-700',
    },
    {
      num: 4,
      q: 'Do I need to register online before travelling?',
      ans: pathway.doINeedOnlineRegistration.required ? `Yes • ${pathway.doINeedOnlineRegistration.systemName}` : 'No Mandatory Online Registration',
      detail: pathway.doINeedOnlineRegistration.explanation,
      subDetail: pathway.doINeedOnlineRegistration.required ? `Submission Deadline: ${pathway.doINeedOnlineRegistration.deadline}` : undefined,
      icon: Globe2,
      badgeColor: pathway.doINeedOnlineRegistration.required ? 'text-sky-300 bg-sky-500/10 border-sky-500/30' : 'text-slate-400 bg-slate-800/40 border-slate-700',
    },
    {
      num: 5,
      q: 'What happens when I arrive?',
      ans: pathway.whatHappensWhenIArrive.arrivalPermitType,
      detail: pathway.whatHappensWhenIArrive.stepByStep.join(' → '),
      list: pathway.whatHappensWhenIArrive.conditions,
      icon: Compass,
      badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    },
    {
      num: 6,
      q: 'What documents do I need?',
      ans: `${pathway.whatDocumentsDoINeed.mandatoryChecklist.length} Mandatory Requirements`,
      detail: `Passport min ${pathway.whatDocumentsDoINeed.passportValidityMonths} months validity with ${pathway.whatDocumentsDoINeed.blankPagesRequired} blank pages. Return ticket: ${pathway.whatDocumentsDoINeed.returnTicketRequired ? 'Mandatory' : 'Optional'}. Accommodation: ${pathway.whatDocumentsDoINeed.accommodationProofRequired ? 'Mandatory' : 'Optional'}. Funds: ${pathway.whatDocumentsDoINeed.proofOfFundsText}`,
      list: pathway.whatDocumentsDoINeed.mandatoryChecklist,
      icon: FileCheck2,
      badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      num: 7,
      q: 'Are there health requirements?',
      ans: pathway.areThereHealthRequirements.yellowFeverRequired ? 'Yellow Fever Vaccination Mandatory' : 'Standard Health Regulations',
      detail: `${pathway.areThereHealthRequirements.yellowFeverDetails} Travel Insurance: ${pathway.areThereHealthRequirements.insuranceMandatory ? 'Mandatory' : 'Recommended'}${pathway.areThereHealthRequirements.insuranceMinCoverage ? ` (${pathway.areThereHealthRequirements.insuranceMinCoverage})` : ''}.`,
      icon: Stethoscope,
      badgeColor: pathway.areThereHealthRequirements.yellowFeverRequired ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' : 'text-slate-300 bg-slate-800/40 border-slate-700',
    },
    {
      num: 8,
      q: 'Are there transit requirements?',
      ans: pathway.areThereTransitRequirements.airsideTransitVisaRequired ? 'Transit Visa May Apply' : 'Airside Transit Visa-Free (<24h)',
      detail: `${pathway.areThereTransitRequirements.transitWarning} Common routes: ${pathway.areThereTransitRequirements.commonRouteHubs}`,
      icon: Plane,
      badgeColor: pathway.areThereTransitRequirements.airsideTransitVisaRequired ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' : 'text-sky-300 bg-sky-500/10 border-sky-500/30',
    },
    {
      num: 9,
      q: 'How do I apply if an application is required?',
      ans: pathway.howDoIApply.applicationLink ? 'Official Government Portal Application' : 'Consular / Port of Entry Protocol',
      detail: pathway.howDoIApply.stepByStepProcedure,
      link: pathway.howDoIApply.applicationLink,
      subDetail: `Recommended timeline: ${pathway.howDoIApply.recommendedSubmissionWindow}`,
      icon: Building2,
      badgeColor: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30',
    },
    {
      num: 10,
      q: 'What does it cost?',
      ans: pathway.whatDoesItCost.totalUSD === 0 ? 'Free of Charge ($0 USD)' : `$${pathway.whatDoesItCost.totalUSD} USD Total Estimate`,
      detail: `Visa Fee: $${pathway.whatDoesItCost.visaFeeUSD} USD • Pre-Auth/ETA Fee: $${pathway.whatDoesItCost.preAuthFeeUSD} USD • Arrival Fee: $${pathway.whatDoesItCost.arrivalFeeUSD} USD. (${pathway.whatDoesItCost.currencyNote})`,
      icon: DollarSign,
      badgeColor: pathway.whatDoesItCost.totalUSD === 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      num: 11,
      q: 'How long does it normally take?',
      ans: pathway.howLongDoesItTake.processingTimeDays,
      detail: pathway.howLongDoesItTake.expeditedAvailable ? 'Expedited processing option available at official surcharge.' : 'Standard statutory processing timeframe.',
      icon: Clock,
      badgeColor: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
    },
    {
      num: 12,
      q: 'What are the conditions or limitations?',
      ans: `Max Stay: ${pathway.whatAreTheConditions.maxDuration}`,
      detail: `Prohibited: ${pathway.whatAreTheConditions.prohibitedActivities.join(', ')}.`,
      list: pathway.whatAreTheConditions.mandatoryConditions,
      icon: AlertTriangle,
      badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    },
    {
      num: 13,
      q: 'What is the official source?',
      ans: pathway.whatIsTheOfficialSource.officialAuthority,
      detail: `Published / Authorized by: ${pathway.whatIsTheOfficialSource.sourceName}. Source Type: ${pathway.whatIsTheOfficialSource.sourceType}.`,
      icon: ShieldCheck,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      num: 14,
      q: 'When was the information last verified?',
      ans: `Verified: ${pathway.whenWasItVerified.lastVerifiedDate}`,
      detail: pathway.whenWasItVerified.isStale 
        ? 'Information may require re-verification.' 
        : 'Active intelligence verified for current travel season.',
      subDetail: pathway.whenWasItVerified.isLiveAvailable ? undefined : 'Live data not currently available.',
      icon: CalendarCheck,
      badgeColor: pathway.whenWasItVerified.isStale ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  const toggleDoc = (doc: string) => {
    setCompletedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Platform Banner: Prototype Demo Data & Freshness Indicators */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-amber-500/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
            DEMO DATA
          </span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Official immigration architecture prototype
          </span>
        </div>

        <div className="flex items-center gap-3">
          {pathway.whenWasItVerified.isStale ? (
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Information may require re-verification
            </span>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified: {pathway.whenWasItVerified.lastVerifiedDate}
            </span>
          )}

          {!pathway.whenWasItVerified.isLiveAvailable && (
            <span className="text-amber-300/80 bg-slate-800/80 px-2 py-0.5 rounded border border-amber-500/30 text-[11px]">
              Live data not currently available
            </span>
          )}
        </div>
      </div>

      {/* Primary Configuration Bar: Passport, Purpose, Transit */}
      <div className="p-4 sm:p-6 bg-slate-950/70 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nationality / Passport Indicator */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              1. Nationality / Passport
            </label>
            <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white font-semibold">
              <span className="text-xl">{passport.flag}</span>
              <div>
                <div className="leading-tight">{passport.name} ({passport.code})</div>
                <div className="text-[11px] font-normal text-slate-400">{passport.demonym} Passport</div>
              </div>
            </div>
          </div>

          {/* Travel Purpose Selector */}
          <div>
            <label htmlFor="select-travel-purpose" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              2. Travel Purpose
            </label>
            <select
              id="select-travel-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as TravelPurpose)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="Tourism / Leisure">🌴 Tourism / Leisure</option>
              <option value="Business">💼 Business & Meetings</option>
              <option value="Visiting Family / Friends">🏡 Visiting Family / Friends</option>
              <option value="Transit">✈️ International Transit / Layover</option>
            </select>
          </div>

          {/* Transit Route Selector */}
          <div>
            <label htmlFor="select-transit-route" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              3. Transit Route / Hub
            </label>
            <select
              id="select-transit-route"
              value={selectedTransit}
              onChange={(e) => setSelectedTransit(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {TRANSIT_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Transit Route Hint */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-sky-400" />
            <span>Transit Policy: <strong className="text-slate-200">{selectedTransitInfo.notes}</strong></span>
          </div>
          <span className="text-[11px] text-amber-400/80 font-mono">
            {passport.code} ✈️ {destination.name}
          </span>
        </div>
      </div>

      {/* CRITICAL UX PRINCIPLE BANNER: Visa Status ≠ Complete Entry Requirements */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/20 via-slate-900 to-sky-950/20 border-b border-slate-800">
        <div className="flex items-start sm:items-center justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400">
                Critical Immigration Principle
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white">
                Visa Status ≠ Complete Entry Requirements
              </div>
            </div>
          </div>

          <TrustBadge level={pathway.whatIsTheOfficialSource.sourceType} />
        </div>

        {/* Executive Plain-English Practical Travel Pathway */}
        <div className="rounded-xl bg-slate-950/90 border border-amber-500/30 p-4 shadow-inner">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
            <span>Practical Entry Pathway for {passport.name} ➔ {destination.name}</span>
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            {pathway.canIEnter.practicalSummary}
          </p>
        </div>
      </div>

      {/* Sub-view Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveSubView('pathway')}
          className={`px-4 py-3 font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubView === 'pathway'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Practical Pathway (14 Questions)
        </button>

        <button
          onClick={() => setActiveSubView('matrix')}
          className={`px-4 py-3 font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubView === 'matrix'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Multi-Status Requirements Matrix
        </button>

        <button
          onClick={() => setActiveSubView('reality_check')}
          className={`px-4 py-3 font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubView === 'reality_check'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Reality Check: Official vs Field Reports ({destination.realityChecks?.length || 0})
        </button>

        <button
          onClick={() => setActiveSubView('checklist')}
          className={`px-4 py-3 font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubView === 'checklist'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Traveller Document Checklist
        </button>
      </div>

      {/* Content for TAB 1: 14 Questions Practical Pathway */}
      {activeSubView === 'pathway' && (
        <div className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              Click any question to view the step-by-step guidance and operational requirements:
            </span>
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === -1 ? null : -1)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              {expandedQuestion === -1 ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {questionsList.map((item) => {
            const isExpanded = expandedQuestion === -1 || expandedQuestion === item.num;
            const Icon = item.icon;

            if (item.num === 1) {
              return (
                <div
                  key={item.num}
                  className={`rounded-xl border transition-all ${
                    isExpanded 
                      ? 'bg-slate-950/90 border-amber-500/40 shadow-lg' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded && expandedQuestion !== -1 ? null : item.num)}
                    className="w-full text-left p-4 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-amber-400 flex-shrink-0">
                          {item.num}
                        </div>
                        <div className="text-sm sm:text-base font-bold text-white">
                          <span>{item.q}</span>
                        </div>
                      </div>

                      <div className="flex items-center flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    <div className="pl-10 w-full">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border leading-relaxed break-words whitespace-normal max-w-full ${item.badgeColor}`}>
                        {item.ans}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 space-y-2.5">
                      <p className="leading-relaxed text-slate-200">
                        {item.detail}
                      </p>

                      {item.subDetail && (
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
                          {item.subDetail}
                        </div>
                      )}

                      {item.list && item.list.length > 0 && (
                        <ul className="space-y-1.5 mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                          {item.list.map((li, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{li}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.link && (
                        <div className="pt-2">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                          >
                            <span>Open Official Application Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={item.num}
                className={`rounded-xl border transition-all ${
                  isExpanded 
                    ? 'bg-slate-950/90 border-amber-500/40 shadow-lg' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setExpandedQuestion(isExpanded && expandedQuestion !== -1 ? null : item.num)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-amber-400 flex-shrink-0">
                      {item.num}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>{item.q}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300 font-medium truncate mt-0.5">
                        {item.ans}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border hidden sm:inline-block ${item.badgeColor}`}>
                      {item.ans}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 space-y-2.5">
                    <p className="leading-relaxed text-slate-200">
                      {item.detail}
                    </p>

                    {item.subDetail && (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
                        {item.subDetail}
                      </div>
                    )}

                    {item.list && item.list.length > 0 && (
                      <ul className="space-y-1.5 mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        {item.list.map((li, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{li}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.link && (
                      <div className="pt-2">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          <span>Open Official Application Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Content for TAB 2: Multi-Status Matrix */}
      {activeSubView === 'matrix' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <strong className="text-amber-300">Simultaneous Entry Requirements: </strong>
            Multiple independent statuses apply to the same trip. Below is the multi-layered breakdown for this journey.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Visa Requirement */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Visa Status</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${pathway.doINeedAVisa.isExempt ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'}`}>
                  {pathway.doINeedAVisa.statusText}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pathway.doINeedAVisa.explanation}
              </p>
            </div>

            {/* 2. Pre-Travel Authorisation / ETA */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Pre-Travel Authorisation / ETA</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${pathway.doINeedAnETA.required ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {pathway.doINeedAnETA.required ? 'Mandatory' : 'Not Applicable'}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>System: <strong>{pathway.doINeedAnETA.systemName}</strong></div>
                <div>Fee: <strong>${pathway.doINeedAnETA.feeUSD} USD</strong> • Lead time: <strong>{pathway.doINeedAnETA.leadTime}</strong></div>
                <p className="text-slate-400">{pathway.doINeedAnETA.explanation}</p>
              </div>
            </div>

            {/* 3. Online Registration & Health Declaration */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Online Travel Registration</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${pathway.doINeedOnlineRegistration.required ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {pathway.doINeedOnlineRegistration.required ? 'Required Prior to Boarding' : 'None'}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Portal: <strong>{pathway.doINeedOnlineRegistration.systemName}</strong></div>
                <div>Deadline: <strong>{pathway.doINeedOnlineRegistration.deadline}</strong></div>
                <p className="text-slate-400">{pathway.doINeedOnlineRegistration.explanation}</p>
              </div>
            </div>

            {/* 4. Arrival Permit & Inspection */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">4. Arrival Permit on Port of Entry</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold border bg-amber-500/10 text-amber-300 border-amber-500/30">
                  {pathway.whatHappensWhenIArrive.arrivalPermitType}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Validity: <strong>{pathway.whatHappensWhenIArrive.validityDuration}</strong></div>
                <p className="text-slate-400">{pathway.whatHappensWhenIArrive.conditions.join('. ')}</p>
              </div>
            </div>

            {/* 5. Health & Yellow Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">5. Health & Medical Mandates</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${pathway.areThereHealthRequirements.yellowFeverRequired ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'}`}>
                  {pathway.areThereHealthRequirements.yellowFeverRequired ? 'Yellow Fever Mandatory' : 'Standard'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pathway.areThereHealthRequirements.yellowFeverDetails} Travel Insurance: {pathway.areThereHealthRequirements.insuranceMandatory ? 'Mandatory policy required' : 'Recommended'}.
              </p>
            </div>

            {/* 6. Transit & Connecting Routes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">6. Transit & Airport Hub Requirements</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold border bg-sky-500/10 text-sky-300 border-sky-500/30">
                  {selectedTransitInfo.label.split('—')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTransitInfo.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content for TAB 3: Dedicated REALITY CHECK (Official vs Traveller Reports) */}
      {activeSubView === 'reality_check' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">
                Official Law vs On-The-Ground Reality
              </div>
              <p className="text-slate-300 leading-relaxed">
                Immigration regulations may look straightforward on government websites, but port health officers, airline check-in agents, and border guards frequently enforce practical hurdles. Community reports are independently audited and strictly separated from statutory government requirements.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {destination.realityChecks && destination.realityChecks.length > 0 ? (
              destination.realityChecks.map((rc: RealityCheckItem) => (
                <div key={rc.id} className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white">{rc.topic}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Confidence:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">
                        {rc.confidenceRating}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* OFFICIAL REQUIREMENT */}
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          OFFICIAL REQUIREMENT
                        </span>
                        <span className="text-[10px] text-slate-400">Govt Source</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {rc.officialPolicy}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400">
                        Authority: <span className="text-slate-300">{rc.officialSource}</span>
                      </div>
                    </div>

                    {/* TRAVELLER REALITY */}
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          TRAVELLER REALITY
                        </span>
                        <span className="text-[10px] text-amber-300/80 font-mono">
                          {rc.reportCount} Field Reports
                        </span>
                      </div>
                      <p className="text-xs text-amber-100 font-medium leading-relaxed">
                        {rc.travellerReality}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Source: <span className="text-slate-300">{rc.communitySource}</span></span>
                        <span>Verified: {rc.lastReportedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                No contradictory border hurdles reported yet for this destination.
              </div>
            )}
          </div>

          {onOpenReportModal && (
            <div className="text-center pt-2">
              <button
                onClick={onOpenReportModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Submit Live Border Experience Report</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content for TAB 4: Traveller Document Checklist */}
      {activeSubView === 'checklist' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Tick off each requirement as you assemble your physical travel dossier:</span>
            <span className="font-mono text-amber-400">
              {Object.values(completedDocs).filter(Boolean).length} / {pathway.whatDocumentsDoINeed.mandatoryChecklist.length} Checked
            </span>
          </div>

          <div className="space-y-2">
            {pathway.whatDocumentsDoINeed.mandatoryChecklist.map((doc, idx) => {
              const isChecked = !!completedDocs[doc];
              return (
                <div
                  key={idx}
                  onClick={() => toggleDoc(doc)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-900'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium ${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {doc}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isChecked ? 'Ready' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1 mt-4">
            <div className="font-bold text-amber-300">Port Health & Funds Rule:</div>
            <div>• Proof of Funds: {pathway.whatDocumentsDoINeed.proofOfFundsText}</div>
            <div>• Yellow Fever Card: {pathway.areThereHealthRequirements.yellowFeverDetails}</div>
          </div>
        </div>
      )}
    </div>
  );
};
