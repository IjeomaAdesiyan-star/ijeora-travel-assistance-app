export type PassportCode = 
  | 'NG' // Nigeria
  | 'KE' // Kenya
  | 'GH' // Ghana
  | 'ZA' // South Africa
  | 'RW' // Rwanda
  | 'GB' // United Kingdom
  | 'US' // United States
  | 'CA' // Canada
  | 'FR' // France
  | 'IN'; // India

export interface PassportOption {
  code: PassportCode;
  name: string;
  flag: string;
  demonym: string;
}

export type VisaStatus = 
  | 'Visa-Free'
  | 'Visa Not Required'
  | 'Visa on Arrival'
  | 'eVisa'
  | 'ETA'
  | 'eTA'
  | 'Electronic Travel Authorisation'
  | 'Online Travel Registration'
  | 'Pre-Travel Registration'
  | 'Visitor Permit on Arrival'
  | 'Entry Permit'
  | 'Embassy / Consulate Application'
  | 'Visa Required'
  | 'Domestic / Citizen';

export type TrustLevel = 'OFFICIAL' | 'VERIFIED' | 'PARTNER' | 'COMMUNITY';

export type TravelPurpose = 'Tourism / Leisure' | 'Business' | 'Visiting Family / Friends' | 'Transit';

export interface PreTravelAuthDetails {
  required: boolean;
  type: 
    | 'ETA'
    | 'eTA'
    | 'Electronic Travel Authorisation'
    | 'Online Travel Registration'
    | 'Pre-Travel Registration'
    | 'Health Declaration'
    | 'None';
  name: string;
  portalUrl?: string;
  deadlineNotice: string;
  feeUSD: number;
  notes?: string;
}

export interface ArrivalPermitDetails {
  type: 
    | 'Visitor Permit on Arrival'
    | 'Entry Permit'
    | 'Standard Border Stamp'
    | 'Visa Stamp on Arrival'
    | 'Automatic Citizen Right'
    | 'Subject to Conditions';
  validityDuration: string;
  conditions: string[];
  feeUSD: number;
  notes?: string;
}

export interface TransitIntelligence {
  airsideTransitVisaRequired: boolean;
  landsideTransitVisaRequired?: boolean;
  transitAuthorisationType: 
    | 'None'
    | 'Transit Visa'
    | 'Airport Transit Visa'
    | 'Transit Authorisation'
    | 'Route Dependent';
  transitRouteNotes: string;
  warning?: string;
}

export interface CostBreakdown {
  visaFeeUSD: number;
  preTravelAuthFeeUSD: number;
  arrivalTaxUSD: number;
  totalUSD: number;
}

export interface VerificationMetadata {
  source: string;
  officialAuthorityName?: string;
  sourceType: TrustLevel;
  datePublished?: string;
  lastVerifiedDate: string;
  requiresReverification?: boolean;
  isLiveAvailable?: boolean;
  isDemoData?: boolean;
  notes?: string;
}

export interface EntryRule {
  status: VisaStatus;
  
  // Executive Practical Travel Pathway Summary (Plain-English translation)
  // E.g. "You can travel without a visa, but you must complete the required pre-travel authorisation before departure."
  practicalPathway?: string;
  canEnter?: 'YES' | 'CONDITIONALLY' | 'VISA_REQUIRED' | 'RESTRICTED';

  // Multi-Status Breakdown (Distinguishing multiple simultaneous requirements)
  // ENTRY INTELLIGENCE = Visa Status + Pre-Travel Authorisation + ETA + Online Registration + Arrival Permit + etc.
  visaRequirement?: {
    status: string;
    details: string;
    isExempt?: boolean;
  };
  preTravelAuth?: PreTravelAuthDetails;
  arrivalPermit?: ArrivalPermitDetails;
  arrivalProcedure?: string; // Step-by-step border protocol on landing

  // Passport & Documentation
  stayDuration: string;
  passportValidityMonths: number;
  blankPagesRequired: number;
  passportRequirementsNote?: string;
  requiredDocuments: string[];
  proofOfFunds: string;
  returnTicketRequired: boolean;
  accommodationProofRequired: boolean;

  // Health
  healthRequirements: {
    yellowFeverRequired: boolean;
    yellowFeverNotes?: string;
    polioRequired?: boolean;
    covidNotes?: string;
    insuranceMandatory: boolean;
    insuranceMinCoverage?: string;
    healthDeclarationRequired?: boolean;
    additionalVaccines?: string[];
  };

  // Transit
  transitRequirements?: TransitIntelligence;
  transitNotes: string;

  // Application, Costs & Window
  applicationProcedure: string;
  applicationLink?: string;
  feeEstimateUSD: number;
  costBreakdown?: CostBreakdown;
  processingTimeDays: string;

  // Conditions & Limitations
  destinationConditions?: string[];
  conditionsAndLimitations?: string[];

  // Source, Trust & Verification
  source: string;
  officialAuthorityName?: string;
  sourceType?: TrustLevel;
  datePublished?: string;
  lastVerifiedDate: string;
  isStale?: boolean;
  isLiveAvailable?: boolean;
  isDemoData?: boolean;
  trustLevel: TrustLevel;
}

export interface RealityCheckItem {
  id: string;
  topic: string;
  officialPolicy: string;
  travellerReality: string;
  officialSource: string;
  communitySource: string;
  reportCount: number;
  lastReportedDate: string;
  confidenceRating: number; // e.g. 96%
  status: 'active' | 'investigating' | 'resolved';
  trustLevel?: TrustLevel;
}

export interface Attraction {
  id: string;
  name: string;
  category: 'Safari' | 'Beaches' | 'Historical' | 'Culture' | 'Nature' | 'Food Market' | 'Architecture' | 'Hidden Gems' | 'Waterfalls' | 'Mountains' | 'Adventure' | 'Resort' | 'Wildlife';
  image: string;
  typicalCostUSD: number;
  openingHours: string;
  bestTime: string;
  recommendedDuration: string;
  location: string;
  tips: string;
  travellerExperience: string;
}

export interface HotelStay {
  id: string;
  name: string;
  category: 'Luxury' | 'Boutique' | 'Mid-Range' | 'Eco-Lodge' | 'Budget' | 'Resort';
  pricePerNightUSD: number;
  rating: number;
  reviewsCount: number;
  image: string;
  goodFor: string[];
  distanceFromCenter: string;
  highlights: string[];
}

export interface FoodCultureItem {
  name: string;
  type: 'Dish' | 'Street Food' | 'Drink' | 'Etiquette' | 'Custom';
  description: string;
  avgCostUSD?: number;
  mustTryLocation?: string;
  culturalNote?: string;
}

export interface RouteOption {
  airline: string;
  departureHub: string;
  flightDuration: string;
  stops: string;
  transitCountry: string;
  transitVisaRequiredForNG: boolean;
  transitNotes: string;
  frequency: string;
  approxFareUSD: number;
}

export interface RouteIntelligence {
  primaryAirport: string;
  code: string;
  routesFromAfrica: RouteOption[];
  localTransitTip: string;
  rideshareAvailable: boolean;
  airportToCityCostUSD: number;
}

export interface TravellerReport {
  id: string;
  author: string;
  nationalityFlag: string;
  date: string;
  entryPort: string;
  experienceRating: number; // 1 to 5
  title: string;
  comment: string;
  trustLevel: 'COMMUNITY';
  helpfulVotes: number;
  verifiedTrip: boolean;
}

export interface ShortVideo {
  id: string;
  title: string;
  caption: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  category: 
    | '48 Hours in...'
    | 'What ₦500,000 Gets You'
    | 'Visa Reality'
    | 'Airport Experience'
    | 'Hidden Gems'
    | 'Street Food'
    | 'Luxury Travel'
    | 'Budget Travel'
    | 'Things Nobody Tells You'
    | 'Before You Go'
    | 'Local Culture'
    | 'Safaris'
    | 'Beaches';
  posterUrl: string;
  videoUrl?: string; // fallback preview visual
  likes: number;
  commentsCount: number;
  saves: number;
  destinationId: string;
  destinationName: string;
  destinationCountry: string;
  destinationFlag: string;
  intelligenceTip: string;
  tags: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: 'Africa' | 'Europe' | 'Asia' | 'Middle East' | 'North America' | 'South America' | 'Central America' | 'Caribbean' | 'Oceania' | 'Indian Ocean';
  flag: string;
  tagline: string;
  overview: string;
  heroImage: string;
  gallery: string[];
  categoryTags: string[];
  bestSeason: string;
  weatherSummary: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRateToUSD: number; // 1 USD = X local units
  dailyBudgetEstimateUSD: {
    budget: number;
    moderate: number;
    luxury: number;
  };
  entryRulesByPassport: Record<PassportCode, EntryRule>;
  realityChecks: RealityCheckItem[];
  attractions: Attraction[];
  hotels: HotelStay[];
  foodAndCulture: FoodCultureItem[];
  routes: RouteIntelligence;
  travellerReports: TravellerReport[];
  events: { name: string; date: string; description: string }[];
  lastVerifiedDate: string;
  hasLiveIntel?: boolean; // false if live travel-information integration is not yet active
  isoCode?: string;
  capital?: string;
  isTrending?: boolean;
  featuredQuote?: string;
  isDomestic?: boolean;
  scope?: 'Domestic' | 'International';
  stateOrProvince?: string;
  domesticCategory?: (
    | 'city'
    | 'beach'
    | 'waterfall'
    | 'mountain'
    | 'wildlife'
    | 'national_park'
    | 'cultural'
    | 'historical'
    | 'festival'
    | 'food'
    | 'resort'
    | 'nature'
    | 'adventure'
    | 'weekend_getaway'
    | 'honeymoon'
    | 'family'
    | 'hidden_gem'
  )[];
  getawayFrom?: string[]; // e.g. ["Abuja", "Lagos", "Enugu", "Port Harcourt"]
  domesticRouteInfo?: {
    flightHubs?: string;
    flightDuration?: string;
    drivingHoursFromLagos?: string;
    drivingHoursFromAbuja?: string;
    roadCondition?: string;
    recommendedTransport?: string;
  };
}

export interface TravelAlert {
  id: string;
  destinationId?: string;
  destinationName: string;
  country: string;
  flag: string;
  type: 'visa_change' | 'visa_free' | 'health_rule' | 'entry_update' | 'disruption' | 'advisory';
  title: string;
  summary: string;
  trustLevel: TrustLevel;
  source: string;
  timestamp: string;
  isUrgent: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  isPrivate: boolean;
  destinationIds: string[];
  createdAt: string;
}

export interface UserPreferences {
  name?: string;
  primaryPassport?: PassportCode;
  nationality?: PassportCode;
  preferredCurrency?: string;
  currency?: string;
  homeAirport?: string;
  budgetTier?: string;
  travelStyle?: string[];
  savedDestinations?: string[];
  savedCollections?: string[];
  savedVideoIds?: string[];
  followedDestinations?: string[];
  followedDestinationIds?: string[];
  collections?: Collection[];
}
