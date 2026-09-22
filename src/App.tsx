import React, { useState, useMemo, useEffect } from 'react';
import { Destination, PassportCode, UserPreferences, ShortVideo, TravelAlert, Collection } from './types';
import { DESTINATIONS } from './data/destinations';
import { SHORT_VIDEOS } from './data/shortVideos';
import { TRAVEL_ALERTS } from './data/alerts';
import { INITIAL_COLLECTIONS } from './data/collections';
import { PASSPORT_OPTIONS } from './data/passports';
import {
  initAuthSession,
  subscribeToAuth,
  signOutUser,
  saveUserProfileToFirestore,
  loadUserProfileFromFirestore,
  saveBookmarksToFirestore,
  loadBookmarksFromFirestore,
  testFirebaseConnection,
} from './lib/firebase';

import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { CanIGoWidget } from './components/CanIGoWidget';
import { DestinationCard } from './components/DestinationCard';
import { RealityCheckCard } from './components/RealityCheckCard';
import { MasonryExplore } from './components/MasonryExplore';
import { ShortVideoFeed } from './components/ShortVideoFeed';
import { CollectionsView } from './components/CollectionsView';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { TravelAlertsModal } from './components/TravelAlertsModal';
import { ReportMisinformationModal } from './components/ReportMisinformationModal';
import { SubmitReportModal } from './components/SubmitReportModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { IjeoraLogo } from './components/IjeoraLogo';

import {
  Compass,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  Plane,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Globe,
} from 'lucide-react';

export default function App() {
  // Global User State
  const [userPassport, setUserPassport] = useState<PassportCode>('NG');
  const [currency, setCurrency] = useState<string>('USD');
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'cango' | 'videos' | 'saved' | 'profile'>('home');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'domestic' | 'visa-free' | 'voa-evisa' | 'visa-required'
  const [selectedScope, setSelectedScope] = useState<'all' | 'domestic' | 'international'>('all');
  const [activeCategory, setActiveCategory] = useState('All');

  // Saved Data State
  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>(['mauritius', 'zanzibar']);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(['vid-1']);
  const [followedDestinationIds, setFollowedDestinationIds] = useState<string[]>(['zanzibar', 'kenya']);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);

  // Modals State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showMisinformationModal, setShowMisinformationModal] = useState(false);
  const [misinformationTopic, setMisinformationTopic] = useState('');
  const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // User Profile
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: 'Adaobi N.',
    primaryPassport: 'NG',
    homeAirport: 'LOS (Murtala Muhammed International, Lagos)',
    budgetTier: 'moderate',
    currency: 'USD',
    travelStyle: ['Beaches & Islands', 'African Safari & Wildlife', 'Global Food & Street Gastronomy'],
    followedDestinations: ['zanzibar', 'kenya'],
    savedCollections: ['col-visa-free-ng', 'col-honeymoon'],
  });

  // Firebase Cloud & Authentication State
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Initialize Firebase and restore preferences & bookmarks
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;

    testFirebaseConnection().then((res) => {
      if (res.ok) {
        setIsFirebaseConnected(true);
      }
    });

    unsubscribeAuth = subscribeToAuth(async (user) => {
      setCurrentUser(user);
      if (user) {
        setFirebaseUid(user.uid);
        setIsFirebaseConnected(true);

        // Load synced bookmarks from Firestore
        const remoteBookmarks = await loadBookmarksFromFirestore(user.uid);
        if (remoteBookmarks && remoteBookmarks.length > 0) {
          setSavedDestinationIds((prev) => Array.from(new Set([...prev, ...remoteBookmarks])));
        }

        // Load synced profile from Firestore
        const remoteProfile = await loadUserProfileFromFirestore(user.uid);
        if (remoteProfile) {
          setPreferences((prev) => ({ ...prev, ...remoteProfile }));
          if (remoteProfile.primaryPassport) {
            setUserPassport(remoteProfile.primaryPassport);
          }
          if (remoteProfile.currency) {
            setCurrency(remoteProfile.currency);
          }
        }
      } else {
        setFirebaseUid(null);
      }
    });

    initAuthSession().catch((e) => {
      console.warn('[Firebase] Session initialization notice:', e);
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Handle Authentication Actions
  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setFirebaseUid(null);
      // Re-initialize guest anonymous session so Firestore operations continue seamlessly
      await initAuthSession();
    } catch (err) {
      console.warn('[Firebase Auth] Sign out error:', err);
    }
  };

  // Handle Saved Toggles
  const handleToggleSaveDestination = (destId: string) => {
    setSavedDestinationIds((prev) => {
      const next = prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId];
      if (firebaseUid) {
        saveBookmarksToFirestore(firebaseUid, next).catch(() => {});
      }
      return next;
    });
  };

  const handleToggleSaveVideo = (vidId: string) => {
    setSavedVideoIds((prev) =>
      prev.includes(vidId) ? prev.filter((id) => id !== vidId) : [...prev, vidId]
    );
  };

  const handleToggleFollowDestination = (destId: string) => {
    setFollowedDestinationIds((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  const handleCreateCollection = (name: string, description: string, isPrivate: boolean) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name,
      description,
      isPrivate,
      destinationIds: [],
      createdAt: new Date().toISOString().split('T')[0],
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    };
    setCollections((prev) => [newCol, ...prev]);
  };

  const handleReportMisinformation = (topic: string) => {
    setMisinformationTopic(topic);
    setShowMisinformationModal(true);
  };

  const handleNewReportSubmitted = (newReport: any) => {
    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === newReport.destinationId) {
          return {
            ...d,
            travellerReports: [newReport, ...d.travellerReports],
          };
        }
        return d;
      })
    );
  };

  // Filtered Destinations for Home Feed
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const rule = dest.entryRulesByPassport[userPassport];
      const visaStatus = rule ? rule.status : 'Visa Required';

      // Scope filter (All, Domestic Nigeria, International)
      if (selectedScope === 'domestic' && !dest.isDomestic) return false;
      if (selectedScope === 'international' && dest.isDomestic) return false;

      // Visa filter
      if (selectedFilter === 'domestic' && !dest.isDomestic && visaStatus !== 'Domestic / Citizen') return false;
      if (selectedFilter === 'visa-free' && visaStatus !== 'Visa-Free' && visaStatus !== 'Domestic / Citizen') return false;
      if (selectedFilter === 'voa-evisa' && !['Visa on Arrival', 'eVisa', 'eTA'].includes(visaStatus)) return false;
      if (selectedFilter === 'visa-required' && visaStatus !== 'Visa Required') return false;

      // Category filter
      if (activeCategory === '🇳🇬 Nigeria Domestic' && !dest.isDomestic && dest.country.toLowerCase() !== 'nigeria') return false;
      if (activeCategory === 'Weekend from Abuja' && !dest.getawayFrom?.includes('Abuja')) return false;
      if (activeCategory === 'Getaways from Lagos' && !dest.getawayFrom?.includes('Lagos')) return false;
      if (activeCategory === 'Waterfalls & Springs' && 
          !dest.domesticCategory?.includes('waterfall') &&
          !dest.attractions.some(a => a.category === 'Waterfalls') &&
          !dest.name.toLowerCase().includes('fall') &&
          !dest.overview.toLowerCase().includes('waterfall') &&
          !dest.overview.toLowerCase().includes('spring')
      ) return false;
      if (activeCategory === 'Mountains & Hiking' &&
          !dest.domesticCategory?.includes('mountain') &&
          !dest.attractions.some(a => a.category === 'Mountains') &&
          !dest.name.toLowerCase().includes('mountain') &&
          !dest.overview.toLowerCase().includes('mountain')
      ) return false;
      if (activeCategory === 'Wildlife & Safari' && 
          !dest.attractions.some(a => a.category === 'Safari' || a.category === 'Wildlife') &&
          !dest.domesticCategory?.includes('wildlife') &&
          !dest.domesticCategory?.includes('national_park')
      ) return false;
      if (activeCategory === 'Rich Culture' && 
          !dest.attractions.some(a => ['Culture', 'Historical', 'Architecture'].includes(a.category)) &&
          !dest.domesticCategory?.includes('cultural') &&
          !dest.domesticCategory?.includes('historical')
      ) return false;
      if (activeCategory === 'Beaches & Islands' && 
          !dest.domesticCategory?.includes('beach') &&
          !dest.tagline.toLowerCase().includes('beach') && 
          !dest.overview.toLowerCase().includes('island') && 
          !dest.overview.toLowerCase().includes('ocean') && 
          !dest.overview.toLowerCase().includes('lagoon') &&
          !dest.attractions.some(a => a.category === 'Beaches' || a.name.toLowerCase().includes('beach') || a.name.toLowerCase().includes('island'))
      ) return false;
      if (activeCategory === 'Hidden Gems' && 
          !dest.domesticCategory?.includes('hidden_gem') &&
          !dest.categoryTags.some(t => t.toLowerCase().includes('gem') || t.toLowerCase().includes('hidden'))
      ) return false;
      if (activeCategory === 'Visa-Free Escapes' && visaStatus !== 'Visa-Free' && visaStatus !== 'Domestic / Citizen') return false;
      if (activeCategory === 'Gastronomy & Food' && dest.foodAndCulture.length === 0) return false;
      if (activeCategory === 'Luxury Stays' && dest.dailyBudgetEstimateUSD.luxury < 400 && !dest.domesticCategory?.includes('resort')) return false;

      // Search query & Natural Language Queries
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();

        // 1. Natural Language Query: "Where should I visit in Nigeria?" or "Best places to visit in Nigeria"
        if (q.includes('nigeria') && (q.includes('where') || q.includes('visit') || q.includes('place') || q.includes('best') || q.includes('tour') || q.includes('holiday'))) {
          return dest.country.toLowerCase() === 'nigeria' || dest.isDomestic;
        }

        // 2. Natural Language Query: "Weekend trips from Abuja" or "Weekend from Abuja"
        if (q.includes('abuja') && (q.includes('weekend') || q.includes('trip') || q.includes('getaway') || q.includes('near') || q.includes('from'))) {
          return dest.getawayFrom?.includes('Abuja') || dest.stateOrProvince?.toLowerCase().includes('abuja') || dest.name.toLowerCase().includes('abuja');
        }

        // 3. Natural Language Query: "Affordable getaways from Lagos" or "Getaways from Lagos"
        if (q.includes('lagos') && (q.includes('getaway') || q.includes('affordable') || q.includes('weekend') || q.includes('escape') || q.includes('from'))) {
          return dest.getawayFrom?.includes('Lagos') || dest.stateOrProvince?.toLowerCase().includes('lagos') || dest.name.toLowerCase().includes('lagos');
        }

        // 4. Natural Language Query: "Beach destinations in Nigeria"
        if ((q.includes('beach') || q.includes('beaches')) && q.includes('nigeria')) {
          return (dest.country.toLowerCase() === 'nigeria' || dest.isDomestic) && (
            dest.domesticCategory?.includes('beach') ||
            dest.tagline.toLowerCase().includes('beach') ||
            dest.overview.toLowerCase().includes('beach') ||
            dest.attractions.some(a => a.category === 'Beaches' || a.name.toLowerCase().includes('beach'))
          );
        }

        // 5. Natural Language Query: "Things to do in Cross River"
        if (q.includes('cross river')) {
          return dest.stateOrProvince?.toLowerCase().includes('cross river') || dest.name.toLowerCase().includes('cross river') || dest.overview.toLowerCase().includes('cross river');
        }

        // Country or destination present in search query (e.g. "Can I visit Brazil?", "Requirements for Japan", "Can Nigerians visit Mauritius?")
        const countryInQuery = q.includes(dest.country.toLowerCase()) || q.includes(dest.name.toLowerCase());
        const matchesIso = dest.isoCode ? q === dest.isoCode.toLowerCase() : false;
        const matchesCapital = dest.capital ? dest.capital.toLowerCase().includes(q) || q.includes(dest.capital.toLowerCase()) : false;

        // Standard token / field matching
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesCountry = dest.country.toLowerCase().includes(q);
        const matchesState = dest.stateOrProvince?.toLowerCase().includes(q) || false;
        const matchesRegion = dest.region.toLowerCase().includes(q);
        const matchesOverview = dest.overview.toLowerCase().includes(q);
        const matchesVisa = visaStatus.toLowerCase().includes(q);
        const matchesAttractions = dest.attractions.some((a) => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.travellerExperience.toLowerCase().includes(q));
        const matchesTags = dest.categoryTags.some((t) => t.toLowerCase().includes(q));
        const matchesDomesticCategory = dest.domesticCategory?.some((c) => c.toLowerCase().includes(q)) || false;
        const matchesGetaway = dest.getawayFrom?.some((g) => g.toLowerCase().includes(q)) || false;

        return (
          countryInQuery ||
          matchesIso ||
          matchesCapital ||
          matchesName ||
          matchesCountry ||
          matchesState ||
          matchesRegion ||
          matchesOverview ||
          matchesVisa ||
          matchesAttractions ||
          matchesTags ||
          matchesDomesticCategory ||
          matchesGetaway
        );
      }

      return true;
    });
  }, [destinations, userPassport, selectedFilter, selectedScope, activeCategory, searchQuery]);

  // All Reality Checks flattened for highlights
  const allRealityChecks = useMemo(() => {
    return destinations.flatMap((d) => d.realityChecks);
  }, [destinations]);

  // All community reports flattened
  const allCommunityReports = useMemo(() => {
    return destinations.flatMap((d) => d.travellerReports);
  }, [destinations]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans'] pb-24 md:pb-12 selection:bg-amber-500 selection:text-slate-950">
      {/* Brand Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userPassport={userPassport}
        setUserPassport={(p) => {
          setUserPassport(p);
          setPreferences((prev) => ({ ...prev, primaryPassport: p }));
        }}
        currency={currency}
        setCurrency={(c) => {
          setCurrency(c);
          setPreferences((prev) => ({ ...prev, currency: c }));
        }}
        onOpenAlerts={() => setShowAlertsModal(true)}
        unreadAlertsCount={TRAVEL_ALERTS.length}
        onSearchClick={() => {
          setCurrentTab('home');
          const searchInput = document.getElementById('input-global-search');
          searchInput?.focus();
        }}
        onOpenProfile={() => setShowProfileModal(true)}
        firebaseConnected={isFirebaseConnected}
        currentUser={currentUser}
        onOpenSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      {/* Main View Router */}
      <main>
        {/* TAB 1: HOME FEED */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Hero & Natural Search */}
            <HeroSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedPassport={userPassport}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              onQuickPrompt={(prompt) => {
                if (prompt.toLowerCase().includes('mauritius')) setSearchQuery('Mauritius');
                else if (prompt.toLowerCase().includes('zanzibar')) setSearchQuery('Zanzibar');
                else if (prompt.toLowerCase().includes('kigali')) setSearchQuery('Kigali');
                else if (prompt.toLowerCase().includes('safari')) setActiveCategory('African Safari');
                else if (prompt.toLowerCase().includes('visa-free')) setSelectedFilter('visa-free');
                else setSearchQuery(prompt);
              }}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            {/* Interactive "Can I Go?" Feature (Section 5) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CanIGoWidget
                destinations={destinations}
                selectedPassport={userPassport}
                onChangePassport={setUserPassport}
                onSelectDestination={(dest) => setSelectedDestination(dest)}
                currency={currency}
              />
            </section>

            {/* Practical Intelligence Before You Book (Section 1) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-sky-950/30 border border-amber-500/20 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        Know Before You Book: Critical Intelligence
                      </h3>
                      <p className="text-xs text-slate-400">
                        Essential checkpoints before paying airlines or reserving non-refundable hotels.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-950 text-amber-300 border border-amber-500/30">
                      Evaluated for {userPassport} Citizen
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Special Local Insurance</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Certain destinations (e.g. Zanzibar) mandate a local state inbound policy ($44) regardless of your existing global policy.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-sky-400 font-bold mb-1.5">
                      <Plane className="w-4 h-4" />
                      <span>Airside Transit Traps</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Self-transfer bookings or multi-airport stopovers in Europe or Gulf hubs may require full airport transit visas.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Yellow Fever Certificate</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Original Yellow Fever yellow card must have been administered at least 10 days before crossing border gates.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-purple-400 font-bold mb-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Cash vs Local Cards</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Carry crisp, unblemished USD bills printed 2013 or newer for visa-on-arrival ports and local currency exchanges.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Trending Destination Feed */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Global Destinations</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                    Destinations & Realities
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Showing {filteredDestinations.length} verified destinations</span>
                  <button
                    onClick={() => setCurrentTab('explore')}
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold ml-2"
                  >
                    <span>View Masonry Board</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scope Switcher: All vs Domestic Nigeria vs International */}
              <div className="mb-6 flex flex-wrap items-center gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 w-fit">
                <button
                  onClick={() => setSelectedScope('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedScope === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>All Destinations ({destinations.length})</span>
                </button>
                <button
                  onClick={() => setSelectedScope('domestic')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedScope === 'domestic'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>🇳🇬</span>
                  <span>Nigeria Domestic ({destinations.filter((d) => d.isDomestic).length})</span>
                </button>
                <button
                  onClick={() => setSelectedScope('international')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedScope === 'international'
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>International ({destinations.filter((d) => !d.isDomestic).length})</span>
                </button>
              </div>

              {filteredDestinations.length === 0 ? (
                <div className="py-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
                  <p className="text-slate-400 text-sm">
                    No destinations found matching your current filter. Try selecting "All" or clearing search.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setActiveCategory('All');
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDestinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      userPassport={userPassport}
                      onSelect={(d) => setSelectedDestination(d)}
                      isSaved={savedDestinationIds.includes(dest.id)}
                      onToggleSave={handleToggleSaveDestination}
                      currency={currency}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Reality Check Spotlight (Section 6 & 26) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Side-by-Side Trust Contrast</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                    The IJEORA Reality Check
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Separating official government policies from confirmed on-the-ground traveller reality.
                  </p>
                </div>

                <button
                  onClick={() => setShowSubmitReportModal(true)}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold transition-colors"
                >
                  + Log Border Reality
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {allRealityChecks.slice(0, 4).map((rc) => (
                  <RealityCheckCard
                    key={rc.id}
                    item={rc}
                    onReportMisinformation={() => handleReportMisinformation(rc.topic)}
                  />
                ))}
              </div>
            </section>

            {/* Community Border Experiences (Section 16) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Real Traveller Reports</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                    On-the-Ground Border Experiences
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCommunityReports.slice(0, 3).map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{rep.nationalityFlag}</span>
                          <div>
                            <strong className="text-sm text-white block">{rep.author}</strong>
                            <span className="text-[11px] text-slate-400">{rep.entryPort}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-500">{rep.date}</span>
                      </div>

                      <h4 className="text-sm font-bold text-amber-200 mt-3">{rep.title}</h4>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                        {rep.comment}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{rep.helpfulVotes} travellers helped</span>
                      </span>
                      {rep.verifiedTrip && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          Verified Trip
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: EXPLORE (Pinterest-style Masonry) */}
        {currentTab === 'explore' && (
          <MasonryExplore
            destinations={destinations}
            userPassport={userPassport}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSaveDestination={handleToggleSaveDestination}
            savedDestinationIds={savedDestinationIds}
            currency={currency}
          />
        )}

        {/* TAB 3: CAN I GO? (Interactive Dedicated Tab) */}
        {currentTab === 'cango' && (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            <CanIGoWidget
              destinations={destinations}
              selectedPassport={userPassport}
              onChangePassport={setUserPassport}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              currency={currency}
            />

            {/* Quick Country Directory for User's Active Passport */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Visa Status Directory for {userPassport} Passport Holders
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((d) => {
                  const r = d.entryRulesByPassport[userPassport];
                  const status = r ? r.status : 'Visa Required';
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDestination(d)}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{d.flag}</span>
                        <div>
                          <strong className="text-sm text-white block">{d.name}</strong>
                          <span className="text-xs text-slate-400">{d.country}</span>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          status.includes('Free')
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                            : status.includes('Arrival') || status.includes('e')
                            ? 'bg-sky-950 text-sky-300 border-sky-500/30'
                            : 'bg-rose-950 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SHORTS (Vertical Video Feed) */}
        {currentTab === 'videos' && (
          <ShortVideoFeed
            videos={SHORT_VIDEOS}
            destinations={destinations}
            onOpenDestination={(dest) => setSelectedDestination(dest)}
            onSaveVideo={handleToggleSaveVideo}
            onReportMisinformation={(title) => handleReportMisinformation(`Short Video: ${title}`)}
            savedVideoIds={savedVideoIds}
          />
        )}

        {/* TAB 5: SAVED & COLLECTIONS */}
        {currentTab === 'saved' && (
          <CollectionsView
            collections={collections}
            destinations={destinations}
            savedDestinationIds={savedDestinationIds}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onCreateCollection={handleCreateCollection}
            currency={currency}
          />
        )}

        {/* TAB 6: PROFILE */}
        {currentTab === 'profile' && (
          <div className="max-w-xl mx-auto py-8 px-4 sm:px-6">
            <UserProfileModal
              preferences={preferences}
              onUpdatePreferences={(up) => {
                setPreferences((prev) => ({ ...prev, ...up }));
                if (up.primaryPassport) setUserPassport(up.primaryPassport);
                if (up.currency) setCurrency(up.currency);
              }}
              onClose={() => setCurrentTab('home')}
              followedCount={followedDestinationIds.length}
              savedCount={savedDestinationIds.length}
              currentUser={currentUser}
              onOpenSignIn={() => setShowAuthModal(true)}
              onSignOut={handleSignOut}
            />
          </div>
        )}

        {/* Global Brand Footer & Emblem Showcase */}
        <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <IjeoraLogo size="lg" showText={true} interactive={true} />
            </div>

            <div className="text-center md:text-right text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">
                The Sovereign Travel Intelligence & Discovery Network
              </p>
              <p>
                Eliminating passport anxiety with real-time border policies, verified entry fees & honest reality checks.
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                © {new Date().getFullYear()} IJEORA. All rights reserved. Built for borderless explorers worldwide.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Destination Detail Intelligence Modal (Comprehensive 10 tabs) */}
      {selectedDestination && (
        <DestinationDetailModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          userPassport={userPassport}
          onChangePassport={setUserPassport}
          currency={currency}
          isSaved={savedDestinationIds.includes(selectedDestination.id)}
          onToggleSave={handleToggleSaveDestination}
          onOpenReportMisinformation={handleReportMisinformation}
          onOpenSubmitReport={() => setShowSubmitReportModal(true)}
          onOpenShortVideo={() => setCurrentTab('videos')}
        />
      )}

      {/* Travel Alerts Modal */}
      {showAlertsModal && (
        <TravelAlertsModal
          alerts={TRAVEL_ALERTS}
          onClose={() => setShowAlertsModal(false)}
          followedDestinationIds={followedDestinationIds}
          onToggleFollowDestination={handleToggleFollowDestination}
        />
      )}

      {/* Misinformation & Moderation Reporting Modal */}
      {showMisinformationModal && (
        <ReportMisinformationModal
          topic={misinformationTopic}
          onClose={() => setShowMisinformationModal(false)}
        />
      )}

      {/* Border Reality Submission Modal */}
      {showSubmitReportModal && (
        <SubmitReportModal
          destinations={destinations}
          userPassport={userPassport}
          onClose={() => setShowSubmitReportModal(false)}
          onSubmitSuccess={handleNewReportSubmitted}
        />
      )}

      {/* User Profile Modal when triggered from header or settings */}
      {showProfileModal && (
        <UserProfileModal
          preferences={preferences}
          onUpdatePreferences={(up) => {
            const next = { ...preferences, ...up };
            setPreferences(next);
            if (up.primaryPassport) setUserPassport(up.primaryPassport);
            if (up.currency) setCurrency(up.currency);
            if (firebaseUid) {
              saveUserProfileToFirestore(firebaseUid, next).catch(() => {});
            }
          }}
          onClose={() => setShowProfileModal(false)}
          followedCount={followedDestinationIds.length}
          savedCount={savedDestinationIds.length}
          currentUser={currentUser}
          onOpenSignIn={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
        />
      )}

      {/* Traveller Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedCount={savedDestinationIds.length}
      />
    </div>
  );
}
