import React, { useState, useMemo } from 'react';
import { Destination, PassportCode, EntryRule } from '../types';
import { PASSPORT_OPTIONS, formatCurrency } from '../data/passports';
import { SHORT_VIDEOS } from '../data/shortVideos';
import { TrustBadge } from './TrustBadge';
import { RealityCheckCard } from './RealityCheckCard';
import { PracticalEntryPathwayView } from './PracticalEntryPathwayView';
import {
  X,
  Bookmark,
  Share2,
  ShieldCheck,
  Coins,
  Plane,
  Building,
  Utensils,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Video,
  ThumbsUp,
  Tag,
  Sun,
  Bus,
  Send,
  Film,
  Play,
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  userPassport: PassportCode;
  onChangePassport: (code: PassportCode) => void;
  currency: string;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenReportMisinformation: (topic: string) => void;
  onOpenSubmitReport: () => void;
  onOpenShortVideo: (videoId: string) => void;
}

type TabType =
  | 'overview'
  | 'cango'
  | 'realitycheck'
  | 'budget'
  | 'routes'
  | 'attractions'
  | 'hotels'
  | 'food_culture'
  | 'community'
  | 'videos';

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  userPassport,
  onChangePassport,
  currency,
  isSaved,
  onToggleSave,
  onOpenReportMisinformation,
  onOpenSubmitReport,
  onOpenShortVideo,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('cango');
  const [copiedLink, setCopiedLink] = useState(false);

  const matchingVideos = useMemo(() => {
    if (!destination) return [];
    return SHORT_VIDEOS.filter(
      (v) =>
        v.destinationId === destination.id ||
        v.destinationName.toLowerCase() === destination.name.toLowerCase() ||
        v.destinationCountry.toLowerCase() === destination.country.toLowerCase() ||
        (destination.name.toLowerCase().includes(v.destinationName.toLowerCase()) && v.destinationName.length > 3)
    );
  }, [destination]);

  if (!destination) return null;

  const currentPassport = PASSPORT_OPTIONS.find((p) => p.code === userPassport) || PASSPORT_OPTIONS[0];
  const rule: EntryRule = destination.entryRulesByPassport[userPassport] || {
    status: 'Visa Required',
    stayDuration: '30 Days',
    passportValidityMonths: 6,
    blankPagesRequired: 2,
    feeEstimateUSD: 80,
    processingTimeDays: '7 - 14 days',
    requiredDocuments: ['Valid Passport', 'Return Ticket', 'Accommodation Voucher'],
    proofOfFunds: '$1,000 liquid funds',
    returnTicketRequired: true,
    accommodationProofRequired: true,
    healthRequirements: { yellowFeverRequired: false, insuranceMandatory: true },
    transitNotes: 'Standard international transit guidelines apply.',
    applicationProcedure: 'Submit through consular portal.',
    lastVerifiedDate: destination.lastVerifiedDate,
    source: 'Official Immigration Authority',
    trustLevel: 'OFFICIAL',
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="destination-intelligence-modal"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 lg:p-6 overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 sm:rounded-3xl shadow-2xl flex flex-col max-h-full sm:max-h-[92vh] overflow-hidden">
        {/* Sticky Header with Destination Identity */}
        <div className="relative min-h-[300px] sm:min-h-[320px] w-full flex-shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-between p-4 sm:p-6">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-950/40" />

          {/* Close & Action Buttons */}
          <div className="relative z-20 flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                <span>{destination.flag}</span>
                <span>{destination.country}</span>
              </span>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 whitespace-nowrap">
                {destination.region}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:bg-slate-800 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Save */}
              <button
                onClick={() => onToggleSave(destination.id)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-colors ${
                  isSaved
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950/80 text-white border-white/20 hover:bg-slate-800'
                }`}
                title="Save Destination"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:bg-rose-900/80 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Destination Hero Text */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-8 w-full">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="text-3xl select-none flex-shrink-0">{destination.flag}</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-['Plus_Jakarta_Sans']">
                  {destination.name}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-2xl drop-shadow leading-relaxed">
                {destination.tagline}
              </p>
              {matchingVideos.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 hover:bg-slate-800 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all shadow-md whitespace-nowrap"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>{matchingVideos.length} Verified Field Short{matchingVideos.length > 1 ? 's' : ''}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Live Passport Switcher on Destination */}
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2 self-start sm:self-auto flex-shrink-0 whitespace-nowrap">
              <span className="text-xs text-slate-400">Evaluating for:</span>
              <select
                value={userPassport}
                onChange={(e) => onChangePassport(e.target.value as PassportCode)}
                className="bg-slate-900 text-xs font-bold text-amber-300 rounded px-2.5 py-1 border border-slate-700 focus:outline-none cursor-pointer"
              >
                {PASSPORT_OPTIONS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.flag} {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {copiedLink && (
            <div className="absolute top-16 right-4 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow-lg animate-fade-in z-30 whitespace-nowrap">
              Link copied!
            </div>
          )}
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-950/95 border-b border-slate-800 px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2 flex-shrink-0 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('cango')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'cango'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Can I Enter?</span>
          </button>
          <button
            onClick={() => setActiveTab('realitycheck')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'realitycheck'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reality Check ({destination.realityChecks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Costs & Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'routes'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Route & Transit</span>
          </button>
          <button
            onClick={() => setActiveTab('attractions')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'attractions'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Attractions ({destination.attractions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'hotels'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Hotels & Stays</span>
          </button>
          <button
            onClick={() => setActiveTab('food_culture')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'food_culture'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Food & Culture</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Traveller Reports ({destination.travellerReports.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'videos'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Field Shorts ({matchingVideos.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Live Data Pending Banner for Global Database Countries */}
          {destination.hasLiveIntel === false && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5 sm:mt-0 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-amber-300 text-sm">Live data not yet available</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-[10px] text-amber-200">
                      Global Country Database
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    <strong>{destination.name}</strong> is indexed in the IJEORA global country dataset with baseline consular visa regulations. Real-time border validation, verified transit lanes, and on-the-ground intelligence feeds are currently compiling for this territory.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenSubmitReport}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-md self-end sm:self-auto flex-shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Field Report</span>
              </button>
            </div>
          )}

          {/* TAB 1: CAN I ENTER? - 14 PRACTICAL QUESTIONS & MULTI-STATUS MATRIX */}
          {activeTab === 'cango' && (
            <div className="space-y-4">
              <PracticalEntryPathwayView
                destination={destination}
                passportCode={userPassport}
                showAllQuestionsDefault={false}
                onOpenReportModal={onOpenSubmitReport}
              />
            </div>
          )}

          {/* TAB 2: REALITY CHECK */}
          {activeTab === 'realitycheck' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">The IJEORA Reality Check</h4>
                  <p className="text-xs text-slate-400">
                    Comparing official government regulations against confirmed on-the-ground traveller experiences.
                  </p>
                </div>

                <button
                  onClick={onOpenSubmitReport}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  + Submit Your Reality
                </button>
              </div>

              {destination.realityChecks.map((item) => (
                <RealityCheckCard
                  key={item.id}
                  item={item}
                  onReportMisinformation={() => onOpenReportMisinformation(item.topic)}
                />
              ))}
            </div>
          )}

          {/* TAB 3: COSTS & BUDGET */}
          {activeTab === 'budget' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                <strong className="text-white">Cost Intelligence Note: </strong>
                Estimated costs are based on recent traveller logs and live exchange rate benchmarks. Prices are illustrative estimates, not guaranteed quotes.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Backpacker / Budget</span>
                  <div className="text-2xl font-black text-emerald-400 my-2">
                    {formatCurrency(destination.dailyBudgetEstimateUSD.budget, currency)}
                    <span className="text-xs text-slate-400 font-normal"> / day</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Hostels, street food, public transport/motos</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-center shadow-lg shadow-amber-500/5">
                  <span className="text-xs font-semibold text-amber-300 uppercase">Moderate / Comfort</span>
                  <div className="text-2xl font-black text-amber-300 my-2">
                    {formatCurrency(destination.dailyBudgetEstimateUSD.moderate, currency)}
                    <span className="text-xs text-slate-400 font-normal"> / day</span>
                  </div>
                  <p className="text-[11px] text-slate-400">3-4★ Boutique hotel, cafes, private taxis</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs font-semibold text-purple-400 uppercase">Luxury / Resort</span>
                  <div className="text-2xl font-black text-purple-300 my-2">
                    {formatCurrency(destination.dailyBudgetEstimateUSD.luxury, currency)}
                    <span className="text-xs text-slate-400 font-normal"> / day</span>
                  </div>
                  <p className="text-[11px] text-slate-400">5★ Beachfront villa, fine dining, private tours</p>
                </div>
              </div>

              {/* Local Currency Benchmark */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>
                  Official Local Currency: <strong className="text-white">{destination.currencyCode} ({destination.currencySymbol})</strong>
                </span>
                <span>
                  Indicative rate: 1 USD ≈ {destination.exchangeRateToUSD.toLocaleString()} {destination.currencyCode}
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: ROUTE & TRANSIT */}
          {activeTab === 'routes' && (
            <div className="space-y-4">
              {destination.domesticRouteInfo && (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <Bus className="w-4 h-4" />
                    <span>Domestic & Interstate Route Intelligence</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                    {destination.domesticRouteInfo.flightHubs && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">Domestic Air Hubs:</span>
                        <strong className="text-white">{destination.domesticRouteInfo.flightHubs}</strong>
                        {destination.domesticRouteInfo.flightDuration && (
                          <span className="text-emerald-400 block mt-0.5">({destination.domesticRouteInfo.flightDuration})</span>
                        )}
                      </div>
                    )}
                    {destination.domesticRouteInfo.recommendedTransport && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">Recommended Transport:</span>
                        <strong className="text-amber-300">{destination.domesticRouteInfo.recommendedTransport}</strong>
                      </div>
                    )}
                    {destination.domesticRouteInfo.drivingHoursFromAbuja && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">Transit from Abuja:</span>
                        <span className="text-slate-200">{destination.domesticRouteInfo.drivingHoursFromAbuja}</span>
                      </div>
                    )}
                    {destination.domesticRouteInfo.drivingHoursFromLagos && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">Transit from Lagos:</span>
                        <span className="text-slate-200">{destination.domesticRouteInfo.drivingHoursFromLagos}</span>
                      </div>
                    )}
                  </div>
                  {destination.domesticRouteInfo.roadCondition && (
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-amber-300">Road & Access Conditions: </strong>
                      {destination.domesticRouteInfo.roadCondition}
                    </p>
                  )}
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Primary International Gateway</span>
                  <h4 className="text-base font-bold text-white">
                    {destination.routes.primaryAirport} ({destination.routes.code})
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Airport Taxi to Center</span>
                  <div className="text-sm font-bold text-amber-300">
                    {formatCurrency(destination.routes.airportToCityCostUSD, currency)}
                  </div>
                </div>
              </div>

              <h5 className="text-sm font-bold text-white mt-4">Typical Connecting Flight Routes</h5>
              <div className="space-y-3">
                {destination.routes.routesFromAfrica.map((route, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <strong className="text-amber-300 font-semibold">{route.airline}</strong>
                      <span className="font-bold text-white">{formatCurrency(route.approxFareUSD, currency)}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Hub Departure:</span>
                        <span>{route.departureHub}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Duration:</span>
                        <span>{route.flightDuration}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Stops:</span>
                        <span>{route.stops}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Transit Country:</span>
                        <span>{route.transitCountry}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 bg-slate-900/60 p-2 rounded">
                      <strong>Transit Note: </strong>
                      {route.transitNotes}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <Bus className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Local Mobility: </strong>
                  {destination.routes.localTransitTip} Rideshare available:{' '}
                  {destination.routes.rideshareAvailable ? 'Yes (Uber/Bolt)' : 'No (Private drivers/taxis)'}.
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: ATTRACTIONS */}
          {activeTab === 'attractions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.attractions.map((att) => (
                <div key={att.id} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
                  <div className="relative h-44 w-full">
                    <img src={att.image} alt={att.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/10">
                      {att.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                      {att.typicalCostUSD === 0 ? 'Free Entry' : formatCurrency(att.typicalCostUSD, currency)}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{att.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{att.location}</p>
                      <p className="text-xs text-slate-300 mt-2">{att.travellerExperience}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-amber-200/90 bg-amber-950/30 p-2 rounded-lg">
                      <strong>Insider Tip: </strong>
                      {att.tips}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: HOTELS */}
          {activeTab === 'hotels' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.hotels.map((ht) => (
                <div key={ht.id} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
                  <div className="relative h-44 w-full">
                    <img src={ht.image} alt={ht.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-purple-300 border border-white/10">
                      {ht.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-amber-400 border border-white/10">
                      ★ {ht.rating} ({ht.reviewsCount})
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white">{ht.name}</h4>
                        <span className="text-sm font-bold text-amber-300">
                          {formatCurrency(ht.pricePerNightUSD, currency)}/night
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{ht.distanceFromCenter}</p>

                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {ht.goodFor.map((tag, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                      Highlights: {ht.highlights.join(' • ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: FOOD & CULTURE */}
          {activeTab === 'food_culture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                  <Sun className="w-4 h-4" />
                  <span>Climate & Best Season to Visit</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Best Season: </strong>
                  {destination.bestSeason}
                </p>
                <p className="text-xs text-slate-400 mt-1">{destination.weatherSummary}</p>
              </div>

              <h4 className="text-base font-bold text-white pt-2">Local Flavors & Cultural Etiquette</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.foodAndCulture.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-amber-300 font-bold">{item.name}</strong>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-slate-200 mt-1">{item.description}</p>
                    {item.culturalNote && (
                      <div className="mt-2.5 p-2 rounded bg-slate-900/80 text-[11px] text-slate-400">
                        <strong>Cultural Context: </strong>
                        {item.culturalNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: COMMUNITY REPORTS */}
          {activeTab === 'community' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Real Traveller Border & Stay Experiences</h4>
                  <p className="text-xs text-slate-400">
                    Community submissions verified for authenticity. Not official government policy.
                  </p>
                </div>
                <button
                  onClick={onOpenSubmitReport}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  + Add Experience
                </button>
              </div>

              <div className="space-y-3">
                {destination.travellerReports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{rep.nationalityFlag}</span>
                        <strong className="text-white">{rep.author}</strong>
                        {rep.verifiedTrip && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Verified Trip
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{rep.date}</span>
                    </div>

                    <h5 className="font-bold text-amber-200 text-sm mt-2">{rep.title}</h5>
                    <p className="text-slate-300 mt-1">{rep.comment}</p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Port of Entry: {rep.entryPort}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <ThumbsUp className="w-3 h-3 text-amber-400" />
                        {rep.helpfulVotes} found helpful
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Tab: Verified Field Shorts Matching This Destination */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-amber-400" />
                    <span>Verified Field Shorts & Vlogs: {destination.name}</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Real traveler recordings covering airport immigration, scams to avoid, transit hacks, and local costs.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-amber-300 font-semibold self-start sm:self-auto">
                  {matchingVideos.length} Matching Video{matchingVideos.length === 1 ? '' : 's'}
                </span>
              </div>

              {matchingVideos.length === 0 ? (
                <div className="py-12 px-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                  <Film className="w-10 h-10 text-slate-600 mx-auto" />
                  <h5 className="text-sm font-bold text-slate-300">
                    No community video published yet for {destination.name}
                  </h5>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Be the first traveler to document the airport arrival and transit reality for {destination.name}!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenShortVideo('vid-1');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Browse All Video Shorts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/50 transition-all flex flex-col"
                    >
                      {/* Video Poster with Play Badge */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                        <img
                          src={vid.posterUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-bold text-amber-300">
                            {vid.category}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onOpenShortVideo(vid.id);
                          }}
                          className="absolute inset-0 flex items-center justify-center group/btn"
                        >
                          <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-amber-400 transition-all">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Creator */}
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={vid.creator.avatar}
                              alt={vid.creator.name}
                              className="w-6 h-6 rounded-full object-cover border border-amber-400/80"
                            />
                            <span className="text-xs font-bold text-white">{vid.creator.name}</span>
                            <span className="text-[10px] text-slate-400">{vid.creator.handle}</span>
                          </div>

                          <h5 className="font-bold text-white text-sm leading-snug">
                            {vid.title}
                          </h5>
                          <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                            {vid.caption}
                          </p>
                        </div>

                        {/* Practical Tip */}
                        <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white">Field Reality: </strong>
                            <span>{vid.intelligenceTip}</span>
                          </div>
                        </div>

                        {/* Watch Button */}
                        <button
                          onClick={() => {
                            onClose();
                            onOpenShortVideo(vid.id);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs border border-slate-700/80 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Full Short & Read Community Comments</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
