import { Destination, PassportCode, EntryRule } from '../types';
import { DOMESTIC_DESTINATIONS } from './domesticDestinations';

// Standard fallback rule generator helper
function createRule(
  status: EntryRule['status'],
  stay: string,
  feeUSD: number,
  timeDays: string,
  procedure: string,
  docs: string[],
  funds: string,
  yellowFever: boolean,
  transit: string,
  source: string,
  trustLevel: EntryRule['trustLevel'] = 'OFFICIAL',
  link?: string,
  isStale: boolean = false
): EntryRule {
  return {
    status,
    stayDuration: stay,
    passportValidityMonths: 6,
    blankPagesRequired: 2,
    feeEstimateUSD: feeUSD,
    processingTimeDays: timeDays,
    requiredDocuments: docs,
    proofOfFunds: funds,
    returnTicketRequired: true,
    accommodationProofRequired: true,
    healthRequirements: {
      yellowFeverRequired: yellowFever,
      yellowFeverNotes: yellowFever ? 'Mandatory yellow card verification from endemic countries' : 'Not required unless arriving from endemic zone',
      insuranceMandatory: feeUSD > 0,
      insuranceMinCoverage: '$50,000 emergency medical coverage recommended',
    },
    transitNotes: transit,
    applicationProcedure: procedure,
    applicationLink: link,
    lastVerifiedDate: '2026-08-15',
    isStale,
    source,
    trustLevel,
  };
}

export const INTERNATIONAL_DESTINATIONS: Destination[] = [
  {
    id: 'zanzibar',
    name: 'Zanzibar',
    country: 'Tanzania',
    region: 'Africa',
    flag: '🇹🇿',
    tagline: 'The Spice Island of Turquoise Lagoons and Stone Town Alleys',
    overview: 'An enchanting archipelago off the coast of East Africa, Zanzibar combines historic Swahili-Arab architecture in Stone Town, world-class diving along coral atolls, and pristine powdery white sand beaches.',
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568444438385-eee3366edc68?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1000&q=80',
    ],
    categoryTags: ['Beaches', 'Culture', 'Historical', 'Food', 'Honeymoon'],
    bestSeason: 'June to October & December to February',
    weatherSummary: 'Warm tropical climate averaging 28°C-31°C year-round. Light sea breezes along the northern coast (Nungwi & Kendwa).',
    currencyCode: 'TZS',
    currencySymbol: 'TSh',
    exchangeRateToUSD: 2600,
    dailyBudgetEstimateUSD: { budget: 45, moderate: 120, luxury: 380 },
    lastVerifiedDate: '2026-09-02',
    isTrending: true,
    featuredQuote: 'Stone Town whispers centuries of spice trade stories, while Kendwa waters glow in impossible turquoise shades.',
    entryRulesByPassport: {
      NG: createRule(
        'eVisa',
        '90 Days',
        50,
        '3 - 7 business days',
        'Apply online via Tanzania Immigration portal (eservices.immigration.go.tz) before travel. Mandatory Zanzibar Inbound Travel Insurance ($44) required upon arrival.',
        ['Passport valid min 6 months', 'Confirmed return ticket', 'Hotel booking confirmation', 'Yellow Fever Vaccination Card', 'Proof of funds ($500 min)'],
        'Credit card statement or minimum $50/day in USD cash',
        true,
        'Direct flights via Ethiopian (Addis Ababa) or Kenya Airways (Nairobi). No transit visa needed if remaining in airport transit under 12 hours.',
        'Tanzania Ministry of Home Affairs & Zanzibar Insurance Corp',
        'OFFICIAL',
        'https://eservices.immigration.go.tz/visa'
      ),
      KE: createRule(
        'Visa-Free',
        '90 Days',
        0,
        'Immediate border stamp',
        'East African Community member. Valid East African passport or national ID accepted for direct entry.',
        ['Valid passport or EAC document', 'Return travel ticket', 'Zanzibar mandatory visitor insurance'],
        'Not strictly audited for EAC citizens',
        false,
        'Frequent 1h 15m direct flights from Nairobi (NBO) or Mombasa (MBA).',
        'EAC Secretariat & Tanzania Immigration',
        'OFFICIAL'
      ),
      GH: createRule(
        'eVisa',
        '90 Days',
        50,
        '3 - 5 business days',
        'Apply online for ordinary tourist eVisa or obtain visa on arrival at Abeid Amani Karume International Airport (ZNZ).',
        ['Passport bio page', 'Yellow Fever certificate', 'Hotel itinerary', 'Return flight'],
        'Bank statement or cash',
        true,
        'Transit via Addis Ababa (ADD) or Kigali (KGL).',
        'Tanzania Immigration',
        'OFFICIAL'
      ),
      ZA: createRule(
        'Visa-Free',
        '90 Days',
        0,
        'Instant on arrival',
        'South African passport holders receive a visa-free entry stamp for tourism stays up to 90 days.',
        ['Passport valid 6 months', 'Zanzibar inbound insurance ($44)', 'Return ticket'],
        'Credit card',
        false,
        'Direct seasonal charter flights from Johannesburg (JNB) or via Nairobi.',
        'South African DIRCO / Tanzania Immigration',
        'OFFICIAL'
      ),
      RW: createRule('Visa-Free', '90 Days', 0, 'Instant', 'EAC member status entry.', ['Passport', 'Return ticket'], 'N/A', false, 'Direct flight RwandAir Kigali-Zanzibar', 'EAC', 'OFFICIAL'),
      GB: createRule('eVisa', '90 Days', 50, '3 - 7 days', 'Apply online via eServices or obtain visa on arrival.', ['Passport', 'Zanzibar insurance', 'Return ticket'], '$50/day', false, 'Via Doha, Dubai or Addis Ababa', 'UK FCDO / Tanzania', 'OFFICIAL'),
      US: createRule('eVisa', '90 Days', 100, '5 - 10 days', 'US citizens must apply for a Multiple Entry Tourist Visa ($100 USD fee mandatory for US passports).', ['US Passport with 6mo validity', 'Hotel booking', 'Return ticket', 'Zanzibar visitor insurance'], '$1,000 liquid funds', false, 'Via Doha, Addis, or Amsterdam', 'US Dept of State / Tanzania', 'OFFICIAL'),
      CA: createRule('eVisa', '90 Days', 50, '3 - 7 days', 'Apply online prior to boarding.', ['Canadian Passport', 'Return flight'], '$50/day', false, 'Via European or Gulf hubs', 'Global Affairs Canada', 'OFFICIAL'),
      FR: createRule('eVisa', '90 Days', 50, '3 - 5 days', 'Apply online or obtain on arrival at ZNZ.', ['Passeport', 'Billet retour', 'Assurance Zanzibar'], 'Moyens de subsistance', false, 'Vols via Paris-Addis-Zanzibar', 'France Diplomatie', 'OFFICIAL'),
      IN: createRule('eVisa', '90 Days', 50, '3 - 5 days', 'Online eVisa application recommended.', ['Passport', 'Return ticket', 'Proof of funds'], '$50/day', true, 'Via Mumbai to Dar es Salaam then ferry or direct flight', 'Indian MEA', 'OFFICIAL'),
    },
    realityChecks: [
      {
        id: 'rc-znz-1',
        topic: 'Mandatory Zanzibar Inbound Travel Insurance ($44)',
        officialPolicy: 'Official Zanzibar Government decree mandates all international incoming tourists purchase government insurance from Zanzibar Insurance Corporation (ZIC) regardless of existing global travel insurance.',
        travellerReality: 'Travellers report the online ZIC payment portal frequently experiences OTP failures with African debit cards. Carry $44 in crisp USD cash (post-2013 bills) or an international Mastercard/Visa for the dedicated airport insurance kiosk before immigration queues.',
        officialSource: 'Zanzibar Insurance Corporation (ZIC) Circular No. 3/2024',
        communitySource: 'Confirmed by 42 verified travellers on IJEORA (August 2026)',
        reportCount: 42,
        lastReportedDate: '2026-09-12',
        confidenceRating: 98,
        status: 'active',
      },
      {
        id: 'rc-znz-2',
        topic: 'Yellow Fever Card Enforcement for Nigerians & West Africans',
        officialPolicy: 'Tanzania official guidance states Yellow Fever is only required when arriving from or transiting >12h through endemic nations.',
        travellerReality: 'Port health officers at ZNZ terminal check Nigerian and Ghanaian passport holders strictly. Having the physical Yellow Card with the verified QR code saves you from mandatory $50 airport quarantine checks or on-the-spot re-vaccination hassles.',
        officialSource: 'Tanzania Ministry of Health Port Health Directive',
        communitySource: '19 Nigerian & Ghanaian travellers border reports',
        reportCount: 19,
        lastReportedDate: '2026-09-08',
        confidenceRating: 95,
        status: 'active',
      },
      {
        id: 'rc-znz-3',
        topic: 'Currency & Card Acceptance outside Resorts',
        officialPolicy: 'Tanzanian Shillings and US Dollars accepted widely throughout Zanzibar.',
        travellerReality: 'Stone Town cafes and beach dhows in Nungwi almost exclusively take Tanzanian Shillings or charge a 5% to 8% merchant markup on cards. ATMs in Stone Town frequently run out of cash on weekends. Exchange cash at the airport or use Barclays/Absa Stone Town branch.',
        officialSource: 'Bank of Tanzania Foreign Exchange Guidelines',
        communitySource: 'Traveller consensus & verified local guides',
        reportCount: 37,
        lastReportedDate: '2026-08-30',
        confidenceRating: 94,
        status: 'active',
      }
    ],
    attractions: [
      {
        id: 'att-stone-town',
        name: 'Historic Stone Town & Freddie Mercury House',
        category: 'Historical',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 15,
        openingHours: '08:00 - 18:30 daily',
        bestTime: 'Early morning or 16:30 for golden hour photography',
        recommendedDuration: '3 - 4 hours',
        location: 'Stone Town, Western coast',
        tips: 'Hire a licensed local Swahili guide at the Old Fort. Modest dress covering shoulders and knees is respected.',
        travellerExperience: 'Get lost in the labyrinth of carved wooden doors. The Forodhani Night Food Market comes alive after 19:00 with Zanzibar pizza and sugarcane juice.'
      },
      {
        id: 'att-prison-island',
        name: 'Changuu (Prison Island) & Giant Aldabra Tortoises',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 35,
        openingHours: '09:00 - 16:00',
        bestTime: 'Morning before midday sun',
        recommendedDuration: '2.5 hours including boat ride',
        location: '30 mins wooden dhow boat from Stone Town seafront',
        tips: 'Negotiate the boat captain fee ($25-$30 for whole boat) or join a shared excursion.',
        travellerExperience: 'Feeding 150-year-old giant tortoises and snorkeling the fringing reef right off the sandbank.'
      },
      {
        id: 'att-nungwi-kendwa',
        name: 'Kendwa Beach & Sunset Dhow Sailing',
        category: 'Beaches',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 25,
        openingHours: 'Open 24/7',
        bestTime: '16:00 to 19:30',
        recommendedDuration: 'Half to full day',
        location: 'North coast (1.5h drive from Stone Town)',
        tips: 'Kendwa is the only beach in Zanzibar unaffected by extreme low tide—you can swim all day.',
        travellerExperience: 'Water is crystal clear like a swimming pool. Sunset dhow cruises with drum music and fresh fruit are unforgettable.'
      }
    ],
    hotels: [
      {
        id: 'ht-zuri',
        name: 'Zuri Zanzibar Resort & Spice Garden',
        category: 'Luxury',
        pricePerNightUSD: 390,
        rating: 4.9,
        reviewsCount: 312,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Couples', 'Honeymoon', 'Eco-Luxury', 'Private Beach'],
        distanceFromCenter: 'Kendwa Beach (60km from ZNZ Airport)',
        highlights: ['Private 300m beach', 'Private villas in spice groves', 'Sunset oceanfront pool']
      },
      {
        id: 'ht-emerson',
        name: 'Emerson Spice Hotel (Restored Sultan Palace)',
        category: 'Boutique',
        pricePerNightUSD: 165,
        rating: 4.8,
        reviewsCount: 489,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Heritage Lovers', 'Foodies', 'Culture Enthusiasts'],
        distanceFromCenter: 'Heart of Stone Town',
        highlights: ['Rooftop sunset seafood dinner', 'Historic Zanzibari architecture', 'Original antique brass furnishings']
      }
    ],
    foodAndCulture: [
      {
        name: 'Zanzibar Pizza at Forodhani Gardens',
        type: 'Street Food',
        description: 'A crispy pan-fried parcel filled with minced beef or spiced chicken, vegetables, egg, laughing cow cheese, and mayonnaise.',
        avgCostUSD: 3,
        mustTryLocation: 'Forodhani Waterfront Market, Stone Town',
        culturalNote: 'Order alongside a cup of freshly pressed sugarcane juice infused with ginger and lime.'
      },
      {
        name: 'Swahili Coconut Fish Curry (Mchuzi wa Samaki)',
        type: 'Dish',
        description: 'Catch of the day simmered in coconut milk, garlic, cloves, turmeric, and cardamom.',
        avgCostUSD: 9,
        mustTryLocation: 'Lukmaan Restaurant, Stone Town',
        culturalNote: 'Stone Town is predominantly Muslim; greet locals with "Jambo" or "As-salamu alaykum". Dressing modestly when leaving the beach is deeply appreciated.'
      }
    ],
    routes: {
      primaryAirport: 'Abeid Amani Karume International Airport',
      code: 'ZNZ',
      routesFromAfrica: [
        {
          airline: 'Ethiopian Airlines',
          departureHub: 'Lagos (LOS) / Abuja (ABV)',
          flightDuration: '7h 45m',
          stops: '1 stop (Addis Ababa ADD)',
          transitCountry: 'Ethiopia',
          transitVisaRequiredForNG: false,
          transitNotes: 'No transit visa required for connections under 12 hours. Baggage checked through to Zanzibar.',
          frequency: 'Daily',
          approxFareUSD: 680,
        },
        {
          airline: 'Kenya Airways',
          departureHub: 'Lagos (LOS) / Accra (ACC)',
          flightDuration: '6h 30m',
          stops: '1 stop (Nairobi NBO)',
          transitCountry: 'Kenya',
          transitVisaRequiredForNG: false,
          transitNotes: 'Easy transit via Terminal 1A. Quick connection to 1h hop to Zanzibar.',
          frequency: 'Daily',
          approxFareUSD: 710,
        }
      ],
      localTransitTip: 'Private taxis from ZNZ Airport to Kendwa/Nungwi cost $35 - $40 fixed. Negotiate or pre-book through your lodge.',
      rideshareAvailable: false,
      airportToCityCostUSD: 15
    },
    travellerReports: [
      {
        id: 'rep-znz-1',
        author: 'Chidinma O.',
        nationalityFlag: '🇳🇬',
        date: '2026-08-28',
        entryPort: 'Zanzibar ZNZ Airport',
        experienceRating: 5,
        title: 'Smooth entry with Nigerian passport, just be ready for the insurance fee',
        comment: 'I landed with Ethiopian Airlines. Showed my printed Tanzania eVisa, yellow fever card, and paid $44 for the new Zanzibar insurance at the counter. Immigration took less than 10 minutes! Kendwa is heaven on earth.',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 64,
        verifiedTrip: true
      },
      {
        id: 'rep-znz-2',
        author: 'Kwame A.',
        nationalityFlag: '🇬🇭',
        date: '2026-08-14',
        entryPort: 'Zanzibar ZNZ Airport',
        experienceRating: 4,
        title: 'Stone Town is magical, take cash for street vendors',
        comment: 'My eVisa arrived 4 days after applying online. Make sure you carry some US dollars printed after 2013, older notes are rejected everywhere in Tanzania.',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 38,
        verifiedTrip: true
      }
    ],
    events: [
      { name: 'Sauti za Busara African Music Festival', date: 'February annually', description: 'One of the most celebrated live African music festivals held in the historic Old Fort.' },
      { name: 'Zanzibar International Film Festival (ZIFF)', date: 'July annually', description: 'Pan-African cinema, coastal poetry, and arts across Stone Town.' }
    ]
  },
  {
    id: 'mauritius',
    name: 'Mauritius',
    country: 'Mauritius',
    region: 'Indian Ocean',
    flag: '🇲🇺',
    tagline: 'Volcanic Peaks, Sapphire Lagoons & Creole Flavors',
    overview: 'An Indian Ocean paradise famous for its dramatic Le Morne Brabant mountain, underwater waterfall illusion, multicultural harmony of Creole, Indian, and French heritage, and warm crystalline lagoons.',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80',
    ],
    categoryTags: ['Beaches', 'Honeymoon', 'Luxury', 'Nature', 'Food'],
    bestSeason: 'May to December (cool dry season)',
    weatherSummary: 'Pleasant sub-tropical climate. Temperatures range between 24°C in winter to 30°C in summer. Crystalline ocean temperatures year-round.',
    currencyCode: 'MUR',
    currencySymbol: '₨',
    exchangeRateToUSD: 46,
    dailyBudgetEstimateUSD: { budget: 65, moderate: 160, luxury: 450 },
    lastVerifiedDate: '2026-09-01',
    isTrending: true,
    featuredQuote: 'Mark Twain famously wrote that heaven was copied after Mauritius.',
    entryRulesByPassport: {
      NG: createRule(
        'Visa-Free',
        '90 Days',
        0,
        'Instant on arrival',
        'Nigerian passport holders enjoy 90 days Visa-Free access to Mauritius for tourism! Must complete the Mauritius All-in-One Digital Travel Form prior to departure.',
        ['Passport valid min 6 months', 'Confirmed return flight ticket', 'Confirmed hotel/resort reservation', 'Proof of sufficient funds ($100/day minimum)'],
        'Credit card statement or minimum $100 per day in USD/EUR',
        false,
        'Direct flights from Nairobi (Kenya Airways) or via Johannesburg (Air Mauritius / South African Airways) or Addis Ababa (Ethiopian).',
        'Passport and Immigration Office Mauritius (Prime Minister’s Office)',
        'OFFICIAL',
        'https://safemauritius.govmu.org'
      ),
      KE: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa-free entry for tourism.', ['Passport', 'Return flight', 'Hotel booking'], '$100/day', false, 'Direct 4h 15m flight via Kenya Airways from Nairobi', 'Mauritius Passport Office', 'OFFICIAL'),
      GH: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa-free 90 days for Ghanaian passport holders.', ['Passport', 'Return ticket', 'Hotel voucher'], '$100/day', false, 'Via Addis Ababa or Nairobi', 'Mauritius Gov', 'OFFICIAL'),
      ZA: createRule('Visa-Free', '90 Days', 0, 'Instant', 'South African passport holders are visa-free for 90 days.', ['Passport', 'Return ticket'], '$100/day', false, '4h direct flight from JNB on Air Mauritius', 'Mauritius Tourism', 'OFFICIAL'),
      RW: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa-free access for Rwandan citizens.', ['Passport', 'Digital Form', 'Return flight'], '$100/day', false, 'Via Nairobi or Addis Ababa', 'Mauritius Gov', 'OFFICIAL'),
      GB: createRule('Visa-Free', '90 Days', 0, 'Instant', 'UK passport holders receive a visa-free entry stamp upon arrival.', ['UK Passport', 'Return flight'], 'Subsistence proof', false, 'Direct British Airways flight from London', 'UK FCDO', 'OFFICIAL'),
      US: createRule('Visa-Free', '90 Days', 0, 'Instant', 'US citizens do not need a visa for stays up to 90 days.', ['US Passport', 'Return ticket'], 'Adequate funds', false, 'Via Paris, Dubai, or London', 'US State Dept', 'OFFICIAL'),
      CA: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa-free entry up to 90 days for Canadian nationals.', ['Canadian Passport', 'Return ticket'], 'Credit card', false, 'Via Paris CDG or Dubai DXB', 'Global Affairs Canada', 'OFFICIAL'),
      FR: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Exemption de visa pour 90 jours.', ['Passeport en cours de validité', 'Billet retour'], 'Carte bancaire', false, 'Vols directs quotidiens Air France / Air Mauritius', 'France Diplomatie', 'OFFICIAL'),
      IN: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Indian citizens enjoy visa-free entry for up to 90 days for tourism.', ['Indian Passport', 'Return ticket', 'Hotel proof'], '$100/day', false, 'Direct Air Mauritius from Mumbai and Delhi', 'Indian MEA', 'OFFICIAL'),
    },
    realityChecks: [
      {
        id: 'rc-mru-1',
        topic: 'Nigerian Passport Visa-Free Entry Reality at SSR Airport',
        officialPolicy: 'Official immigration policy grants 90 days visa-free entry to Nigerian tourists with valid passport, return ticket, and accommodation.',
        travellerReality: 'While legally 100% visa-free, immigration officers at Sir Seewoosagur Ramgoolam (SSR) Airport strictly verify hotel vouchers. Unconfirmed Airbnb bookings or lack of return tickets can trigger secondary screening. Always carry a printed resort confirmation and an international card or $600+ cash proof.',
        officialSource: 'Passport and Immigration Office Mauritius - Section 12',
        communitySource: '88 verified Nigerian travellers on IJEORA',
        reportCount: 88,
        lastReportedDate: '2026-09-15',
        confidenceRating: 99,
        status: 'active',
      },
      {
        id: 'rc-mru-2',
        topic: 'Mauritius All-in-One Digital Travel Card QR Code',
        officialPolicy: 'All passengers are required to complete the digital travel form online at safemauritius.govmu.org before arrival.',
        travellerReality: 'Airline check-in counters in Lagos, Nairobi, and Johannesburg will not issue boarding passes without seeing your generated QR code PDF. Fill it out 48 hours before your flight.',
        officialSource: 'Mauritius Ministry of Health & Wellness',
        communitySource: 'Airline gate agents & traveller reports',
        reportCount: 53,
        lastReportedDate: '2026-09-04',
        confidenceRating: 97,
        status: 'active',
      }
    ],
    attractions: [
      {
        id: 'att-le-morne',
        name: 'Le Morne Brabant UNESCO Mountain & Lagoon',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 45,
        openingHours: '06:00 - 16:00',
        bestTime: '06:30 AM sunrise hike',
        recommendedDuration: '3.5 - 4 hours',
        location: 'Southwestern peninsula',
        tips: 'Hiking requires an accredited mountain guide for the steep upper scramble. Sturdy hiking shoes mandatory.',
        travellerExperience: 'Standing atop Le Morne with the coral reef and turquoise underwater canyon below is deeply emotional and breathtaking.'
      },
      {
        id: 'att-chamarel',
        name: 'Chamarel Seven Coloured Earths & Waterfall',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 14,
        openingHours: '08:30 - 17:30',
        bestTime: 'Midday when sunlight highlights the red, violet, and golden dunes',
        recommendedDuration: '2 hours',
        location: 'Chamarel, Riviere Noire',
        tips: 'Visit the nearby Rhumerie de Chamarel for local sugarcane rum tasting.',
        travellerExperience: 'The geological dunes never erode despite torrential tropical rains. The 100m waterfall nearby is spectacular.'
      }
    ],
    hotels: [
      {
        id: 'ht-lux-grand-baie',
        name: 'LUX* Grand Baie Resort & Residences',
        category: 'Luxury',
        pricePerNightUSD: 520,
        rating: 4.9,
        reviewsCount: 290,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Modern Luxury', 'Couples', 'Rooftop Pool', 'Fine Dining'],
        distanceFromCenter: 'Grand Baie, North Coast',
        highlights: ['Bisou rooftop infinity pool', 'Jean-Francois Adam design', 'Michelin-caliber culinary experiences']
      },
      {
        id: 'ht-outrigger',
        name: 'Outrigger Mauritius Beach Resort',
        category: 'Mid-Range',
        pricePerNightUSD: 195,
        rating: 4.7,
        reviewsCount: 420,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Families', 'Water Sports', 'All-Inclusive Value'],
        distanceFromCenter: 'Bel Ombre, South Coast',
        highlights: ['Navasana Spa', 'Plantation club lounge', 'Kite surfing lagoon']
      }
    ],
    foodAndCulture: [
      {
        name: 'Dholl Puri with Rougaille & Chutney',
        type: 'Street Food',
        description: 'Thin yellow split-pea flatbread griddled hot and filled with Creole tomato sauce (rougaille), curried butter beans, and chili-coriander paste.',
        avgCostUSD: 1.5,
        mustTryLocation: 'Dewa & Sons in Rose Hill or Port Louis Central Market',
        culturalNote: 'Mauritius is one of the most culturally peaceful places on earth, where Hindu temples, mosques, churches, and Chinese pagodas stand side by side.'
      }
    ],
    routes: {
      primaryAirport: 'Sir Seewoosagur Ramgoolam International Airport',
      code: 'MRU',
      routesFromAfrica: [
        {
          airline: 'Kenya Airways',
          departureHub: 'Lagos (LOS) / Nairobi (NBO)',
          flightDuration: '8h 30m total',
          stops: '1 stop (Nairobi NBO)',
          transitCountry: 'Kenya',
          transitVisaRequiredForNG: false,
          transitNotes: 'Smooth connection at JKIA. Baggage interlined directly to Mauritius.',
          frequency: '4x weekly',
          approxFareUSD: 820
        },
        {
          airline: 'Air Mauritius & South African Airways',
          departureHub: 'Lagos (LOS) / Johannesburg (JNB)',
          flightDuration: '9h 15m total',
          stops: '1 stop (Johannesburg JNB)',
          transitCountry: 'South Africa',
          transitVisaRequiredForNG: false,
          transitNotes: 'Direct airside transit via JNB international transit lounge does not require South African transit visa for confirmed onward ticket under 24 hours.',
          frequency: 'Daily',
          approxFareUSD: 860
        }
      ],
      localTransitTip: 'Renting a car (driving on the left, British system) is best to explore the south coast. Reliable daily rental is $30/day.',
      rideshareAvailable: false,
      airportToCityCostUSD: 45
    },
    travellerReports: [
      {
        id: 'rep-mru-1',
        author: 'Tobi & Funke',
        nationalityFlag: '🇳🇬',
        date: '2026-09-02',
        entryPort: 'SSR International Airport MRU',
        experienceRating: 5,
        title: 'Honeymoon of our dreams on green Nigerian passport!',
        comment: 'We were nervous because people kept asking if Nigerians really enter Mauritius without a visa. YES, we do! The immigration lady was polite, checked our return ticket on Kenya Airways, stamped us for 30 days, and smiled. Do Le Morne hike early morning!',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 112,
        verifiedTrip: true
      }
    ],
    events: [
      { name: 'Festival International Kreol', date: 'November annually', description: 'Island-wide celebration of Creole music (Sega dance), poetry, and gastronomy.' }
    ]
  },
  {
    id: 'france',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    flag: '🇫🇷',
    tagline: 'The City of Light, Haute Couture & Architectural Wonder',
    overview: 'The global capital of art, gastronomy, and culture. From the grand iron latticework of the Eiffel Tower to candlelit bistros in Le Marais, Paris represents iconic timeless discovery.',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=1000&q=80',
    ],
    categoryTags: ['Culture', 'Historical', 'Architecture', 'Food', 'Luxury', 'Shopping'],
    bestSeason: 'April to June & September to November',
    weatherSummary: 'Mild spring and autumn temperatures around 16°C-22°C. Pleasant walking weather along the Seine.',
    currencyCode: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    dailyBudgetEstimateUSD: { budget: 85, moderate: 220, luxury: 650 },
    lastVerifiedDate: '2026-09-10',
    isTrending: true,
    entryRulesByPassport: {
      NG: createRule(
        'Visa Required',
        'Up to 90 Days',
        90,
        '15 - 30 calendar days',
        'Standard Schengen Short-Stay Visa required. Applications submitted via France-Visas portal, biometrics processed through VFS Global in Lagos or Abuja.',
        ['Passport valid min 3 months beyond intended departure', 'Completed Schengen form', '6 months verifiable bank statements showing sufficient funds', 'Travel health insurance min €30,000', 'Confirmed flight reservation', 'Hotel voucher or Attestation d’accueil', 'Tax clearance / proof of employment/business registration'],
        'Official guideline is €65/day with hotel booking, but Nigerian applicants should demonstrate minimum €3,000+ verifiable balance',
        false,
        'Direct Air France flights from Lagos (LOS) and Abuja (ABV). Transit in European airports (e.g. Frankfurt, Amsterdam) is permitted with valid Schengen visa.',
        'Ministère de l’Intérieur / France-Visas',
        'OFFICIAL',
        'https://france-visas.gouv.fr'
      ),
      KE: createRule('Visa Required', '90 Days', 90, '15 - 25 days', 'Schengen Visa required via VFS Nairobi.', ['Passport', 'Bank statements', 'Travel insurance €30k', 'Flight itinerary'], '€65/day', false, 'Direct Kenya Airways flight Nairobi-Paris CDG', 'France-Visas Kenya', 'OFFICIAL'),
      GH: createRule('Visa Required', '90 Days', 90, '15 - 30 days', 'Schengen Visa required via VFS Accra.', ['Passport', 'Employment proof', 'Financial statements', 'Insurance'], '€65/day', false, 'Air France direct Accra-Paris', 'France-Visas Ghana', 'OFFICIAL'),
      ZA: createRule('Visa Required', '90 Days', 90, '15 - 21 days', 'Schengen Visa required via VFS Johannesburg/Cape Town.', ['Passport', 'Bank statements', 'Itinerary'], '€65/day', false, 'Air France direct JNB-CDG', 'France-Visas SA', 'OFFICIAL'),
      RW: createRule('Visa Required', '90 Days', 90, '15 - 21 days', 'Schengen Visa through French Embassy in Kigali.', ['Passport', 'Financial documentation'], '€65/day', false, 'Via Brussels or Doha', 'France-Visas Rwanda', 'OFFICIAL'),
      GB: createRule('Visa-Free', '90 Days within 180', 0, 'Instant', 'Post-Brexit 90/180-day rule applies.', ['UK Passport (issued <10 years ago, valid >3 months)'], 'Subsistence check', false, 'Eurostar or short 1h flight', 'UK FCDO', 'OFFICIAL'),
      US: createRule('eTA', '90 Days', 8, '1 - 24 hours', 'Visa-free for 90 days. ETIAS electronic authorization required for travel to Schengen Area.', ['US Passport', 'Approved ETIAS'], 'Credit card', false, 'Numerous direct flights daily', 'EU ETIAS Portal', 'OFFICIAL'),
      CA: createRule('eTA', '90 Days', 8, '1 - 24 hours', 'ETIAS authorization required for Canadian passports.', ['Canadian Passport', 'Approved ETIAS'], 'Credit card', false, 'Direct Air Canada & Air France', 'EU ETIAS', 'OFFICIAL'),
      FR: createRule('Visa-Free', 'Unlimited', 0, 'Citizen', 'French citizen right of residence.', ['National ID or Passport'], 'N/A', false, 'Domestic travel', 'Gouv.fr', 'OFFICIAL'),
      IN: createRule('Visa Required', '90 Days', 90, '15 - 20 days', 'Schengen Visa required through VFS India.', ['Passport', 'ITR 3 years', 'Bank statements', 'Insurance'], '€65/day', false, 'Direct Air France from Delhi/Mumbai', 'France-Visas India', 'OFFICIAL'),
    },
    realityChecks: [
      {
        id: 'rc-fra-1',
        topic: 'VFS Appointment Availability & Processing Delays in West Africa',
        officialPolicy: 'France-Visas states processing time is officially 15 calendar days from biometric submission.',
        travellerReality: 'In Lagos and Abuja, appointment slots book out 6 to 8 weeks in advance during summer and December. Real processing takes 21 to 28 days. Travellers should apply 2.5 months before travel. Beware of third-party slot scalpers charging fake fees.',
        officialSource: 'Consulat Général de France à Lagos',
        communitySource: '124 verified travellers on IJEORA',
        reportCount: 124,
        lastReportedDate: '2026-09-14',
        confidenceRating: 98,
        status: 'active',
      },
      {
        id: 'rc-fra-2',
        topic: 'Metro & Public Transport Card (Navigo Easy vs Paper Tickets)',
        officialPolicy: 'Single paper t+ tickets have been phased out in favor of the digital Navigo Easy card or smartphone NFC tap.',
        travellerReality: 'Do not queue at ticket machines with huge lines at CDG airport. Install the Île-de-France Mobilités app on iPhone/Android to buy tickets directly and tap your phone at the turnstiles.',
        officialSource: 'RATP Paris Transport Authority',
        communitySource: 'Paris travel consensus',
        reportCount: 76,
        lastReportedDate: '2026-09-01',
        confidenceRating: 96,
        status: 'active',
      }
    ],
    attractions: [
      {
        id: 'att-eiffel',
        name: 'Eiffel Tower & Champ de Mars',
        category: 'Architecture',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 32,
        openingHours: '09:30 - 23:45',
        bestTime: 'Sunset into dusk (sparkling light show at top of every hour)',
        recommendedDuration: '2.5 hours',
        location: '7th arrondissement',
        tips: 'Book summit elevator tickets strictly 60 days in advance on the official toureiffel.paris website to avoid 3-hour walk-up lines.',
        travellerExperience: 'Viewing Paris from the top as the lights turn on across the Seine is truly unforgettable.'
      },
      {
        id: 'att-louvre',
        name: 'The Louvre Museum & Glass Pyramid',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 24,
        openingHours: '09:00 - 18:00 (Wed/Fri open late till 21:45)',
        bestTime: 'Wednesday or Friday evening after 18:00',
        recommendedDuration: '3 - 5 hours',
        location: '1st arrondissement',
        tips: 'Timed-entry ticket is mandatory. Enter through the Carrousel du Louvre underground entrance to skip outdoor plaza queues.',
        travellerExperience: 'Beyond Mona Lisa, the Winged Victory of Samothrace and Napoleon III apartments are stunning.'
      }
    ],
    hotels: [
      {
        id: 'ht-brach',
        name: 'Brach Paris (Designed by Philippe Starck)',
        category: 'Luxury',
        pricePerNightUSD: 590,
        rating: 4.8,
        reviewsCount: 180,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Boutique Design', 'Rooftop Eiffel View', 'Wellness'],
        distanceFromCenter: '16th arrondissement (Passy)',
        highlights: ['Rooftop kitchen garden with 360° Eiffel views', 'Sports club & subterranean warm pool']
      }
    ],
    foodAndCulture: [
      {
        name: 'Fresh Butter Croissant & Cafe Creme',
        type: 'Dish',
        description: 'Flaky 100% Normandy butter artisanal croissant from a neighborhood boulangerie.',
        avgCostUSD: 2.2,
        mustTryLocation: 'Du Pain et des Idées (10th) or any artisan baker showing "Artisan Boulanger"',
        culturalNote: 'Always say "Bonjour Madame" or "Bonjour Monsieur" when entering any boutique, bakery, or cafe before asking a question. Skipping this is perceived as rude.'
      }
    ],
    routes: {
      primaryAirport: 'Paris Charles de Gaulle Airport',
      code: 'CDG',
      routesFromAfrica: [
        {
          airline: 'Air France',
          departureHub: 'Lagos (LOS) / Abuja (ABV) / Nairobi (NBO)',
          flightDuration: '6h 25m',
          stops: 'Non-stop direct',
          transitCountry: 'None',
          transitVisaRequiredForNG: false,
          transitNotes: 'Direct non-stop service. Terminal 2E arrival.',
          frequency: 'Daily',
          approxFareUSD: 1100
        }
      ],
      localTransitTip: 'RER B train from CDG Airport to Châtelet-Les Halles costs €11.80 and takes 38 mins, avoiding motorway traffic.',
      rideshareAvailable: true,
      airportToCityCostUSD: 60
    },
    travellerReports: [
      {
        id: 'rep-fra-1',
        author: 'Damilola B.',
        nationalityFlag: '🇳🇬',
        date: '2026-08-19',
        entryPort: 'Paris CDG Airport',
        experienceRating: 4,
        title: 'Got Schengen visa in 3 weeks, loved the cafe culture',
        comment: 'Submitted at VFS Lagos with 6 months business account and flight reservations. French border officer at CDG asked to see my return ticket and hotel voucher. Once through, taking the RER B was easy. Buy metro pass on phone!',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 51,
        verifiedTrip: true
      }
    ],
    events: [
      { name: 'Nuit Blanche Contemporary Art Festival', date: 'June annually', description: 'All-night public art installations and museum openings throughout Paris.' }
    ]
  },
  {
    id: 'japan',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    flag: '🇯🇵',
    tagline: 'Futuristic Megacity Meets Ancient Shrines & Culinary Perfection',
    overview: 'Tokyo is an exhilarating collision of neon-lit skyscrapers, tranquil Shinto shrines, Michelin-starred back-alley ramen bars, and the world’s most punctual railway system.',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80',
    ],
    categoryTags: ['Culture', 'Food', 'Technology', 'Architecture', 'Nightlife', 'Safety'],
    bestSeason: 'Late March to May (Cherry Blossoms) & October to November (Autumn Leaves)',
    weatherSummary: 'Four distinct seasons. Spring and autumn are crisp and clear (15°C - 21°C). Summers are hot and humid.',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    exchangeRateToUSD: 152,
    dailyBudgetEstimateUSD: { budget: 60, moderate: 150, luxury: 490 },
    lastVerifiedDate: '2026-09-08',
    isTrending: true,
    entryRulesByPassport: {
      NG: createRule(
        'eVisa',
        'Up to 90 Days',
        25,
        '7 - 14 working days',
        'Nigerian passport holders residing in eligible consular jurisdictions can apply for the Japan Single-Entry Tourist eVisa through the JAPAN eVISA website (mofa.go.jp). Physical visa sticker via Embassy of Japan in Abuja is also available.',
        ['Passport valid min 6 months', 'Digital photo meeting specifications', 'Bank statement min 6 months showing regular income', 'Day-by-day itinerary schedule (Schedule of Stay)', 'Flight booking confirmation', 'Hotel reservations'],
        'Minimum $2,500 equivalent in verifiable liquid bank funds',
        false,
        'Transit through Doha (Qatar Airways), Dubai (Emirates), or Addis Ababa (Ethiopian Airlines). No transit visa needed if staying airside under 24 hours.',
        'Ministry of Foreign Affairs of Japan (MOFA)',
        'OFFICIAL',
        'https://www.evisa.mofa.go.jp'
      ),
      KE: createRule('eVisa', '90 Days', 25, '5 - 7 days', 'Online eVisa system available via MOFA portal.', ['Passport', 'Bank statements', 'Itinerary'], '$2,500', false, 'Via Doha or Dubai', 'MOFA Japan', 'OFFICIAL'),
      GH: createRule('eVisa', '90 Days', 25, '7 - 10 days', 'Apply online via Japan eVisa system or Embassy in Accra.', ['Passport', 'Flight booking', 'Bank funds'], '$2,500', false, 'Via Addis or Gulf hubs', 'MOFA Japan', 'OFFICIAL'),
      ZA: createRule('eVisa', '90 Days', 25, '5 days', 'eVisa online application eligible for South African nationals.', ['Passport', 'Itinerary', 'Proof of funds'], '$2,000', false, 'Via Singapore or Hong Kong', 'MOFA Japan', 'OFFICIAL'),
      RW: createRule('eVisa', '90 Days', 25, '7 days', 'Apply online via Japan eVisa portal.', ['Passport', 'Bank records', 'Hotel bookings'], '$2,000', false, 'Via Doha or Dubai', 'MOFA Japan', 'OFFICIAL'),
      GB: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa exemption for British citizens.', ['UK Passport', 'Visit Japan Web registration'], 'Proof of return', false, 'Direct flights London Heathrow to Tokyo Haneda', 'Japan MOFA', 'OFFICIAL'),
      US: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa exemption for US citizens for short stays.', ['US Passport', 'Visit Japan Web QR code'], 'Return ticket', false, 'Direct non-stop from major US cities', 'US State Dept / Japan MOFA', 'OFFICIAL'),
      CA: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa exemption for Canadian citizens.', ['Canadian Passport', 'Return flight'], 'Credit card', false, 'Direct Air Canada & ANA', 'Global Affairs Canada', 'OFFICIAL'),
      FR: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Exemption de visa pour séjours touristiques de 90 jours.', ['Passeport', 'Billet retour'], 'Carte bancaire', false, 'Vols directs Air France / ANA Paris-Tokyo', 'France Diplomatie', 'OFFICIAL'),
      IN: createRule('eVisa', '90 Days', 25, '5 - 7 days', 'Eligible for Japan tourist eVisa online.', ['Indian Passport', 'Bank statement', 'ITR'], '$2,500', false, 'Direct ANA from Delhi/Mumbai', 'MOFA Japan', 'OFFICIAL'),
    },
    realityChecks: [
      {
        id: 'rc-jp-1',
        topic: 'Visit Japan Web Digital Customs & Immigration Fast Track',
        officialPolicy: 'Official MOFA guidance encourages travellers to pre-register immigration and customs declarations on Visit Japan Web to receive QR codes.',
        travellerReality: 'Registering on Visit Japan Web (vjw-lp.digital.go.jp) at least 24 hours prior to landing at Narita or Haneda saves 45 minutes at the terminal. Take screenshots of both the Immigration and Customs QR codes in case airport Wi-Fi is slow.',
        officialSource: 'Digital Agency of Japan & Japan Customs',
        communitySource: '92 verified travellers on IJEORA',
        reportCount: 92,
        lastReportedDate: '2026-09-11',
        confidenceRating: 99,
        status: 'active',
      },
      {
        id: 'rc-jp-2',
        topic: 'Cash vs Digital IC Cards (Suica / Pasmo)',
        officialPolicy: 'Credit cards and mobile payments are accepted at major stores across Tokyo.',
        travellerReality: 'Local ramen shops, shrine donation stalls, coin lockers, and small izakayas still strictly require Japanese Yen cash or transit IC cards (Suica/Pasmo). You can add a digital Suica card directly to your Apple Wallet / Google Wallet with zero deposit fee.',
        officialSource: 'Japan Tourism Agency & JR East',
        communitySource: 'Tokyo local guides & travellers',
        reportCount: 110,
        lastReportedDate: '2026-09-05',
        confidenceRating: 98,
        status: 'active',
      }
    ],
    attractions: [
      {
        id: 'att-sensoji',
        name: 'Senso-ji Temple & Nakamise Shopping Dori',
        category: 'Historical',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 0,
        openingHours: 'Main hall 06:00 - 17:00, temple grounds open 24/7',
        bestTime: '07:00 AM before tour crowds arrive or 20:00 for illuminated pagoda photography',
        recommendedDuration: '2 hours',
        location: 'Asakusa, Taito City',
        tips: 'Draw an "Omikuji" fortune paper (100 yen). If it says bad fortune, tie it to the pine racks to leave it behind.',
        travellerExperience: 'Smell of incense rising from the great bronze cauldron and the giant red lantern at Kaminarimon Gate.'
      },
      {
        id: 'att-shibuya-sky',
        name: 'Shibuya Sky & Shibuya Crossing Scramble',
        category: 'Architecture',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 16,
        openingHours: '10:00 - 22:30',
        bestTime: 'Sunset slot (must reserve exactly 28 days ahead at midnight JST)',
        recommendedDuration: '1.5 hours',
        location: 'Shibuya Scramble Square',
        tips: 'Bags and tripods must be stored in lockers before heading to the open-air rooftop deck.',
        travellerExperience: '360-degree glass panorama over the neon heart of Tokyo with Mount Fuji visible on clear days.'
      }
    ],
    hotels: [
      {
        id: 'ht-trunk',
        name: 'TRUNK(HOTEL) Yoyogi Park',
        category: 'Boutique',
        pricePerNightUSD: 360,
        rating: 4.9,
        reviewsCount: 195,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Design', 'Infinity Pool', 'Park Views', 'Shibuya Proximity'],
        distanceFromCenter: 'Tomigaya, Shibuya',
        highlights: ['Heated rooftop pool overlooking Yoyogi Park', 'Minimalist timber Japanese architecture']
      }
    ],
    foodAndCulture: [
      {
        name: 'Tonkotsu Ramen with Chashu Pork & Soft-Boiled Egg',
        type: 'Dish',
        description: 'Rich, creamy pork bone broth simmered for 18 hours with hand-pulled springy noodles.',
        avgCostUSD: 8,
        mustTryLocation: 'Ichiran Shibuya or Rokurinsha in Tokyo Station Ramen Street',
        culturalNote: 'Slurping noodles vigorously is a compliment to the chef in Japan and helps cool the piping hot broth. Never leave chopsticks sticking vertically into a rice bowl (associated with Buddhist funeral rites).'
      }
    ],
    routes: {
      primaryAirport: 'Haneda Airport (HND) / Narita Airport (NRT)',
      code: 'HND',
      routesFromAfrica: [
        {
          airline: 'Qatar Airways',
          departureHub: 'Lagos (LOS) / Nairobi (NBO) / Johannesburg (JNB)',
          flightDuration: '18h 30m total',
          stops: '1 stop (Doha DOH)',
          transitCountry: 'Qatar',
          transitVisaRequiredForNG: false,
          transitNotes: 'Hamad International Airport transit is seamless. Free transit hotel available for long layovers on eligible fares.',
          frequency: 'Daily',
          approxFareUSD: 1250
        },
        {
          airline: 'Emirates',
          departureHub: 'Lagos (LOS) / Accra (ACC) / Nairobi (NBO)',
          flightDuration: '19h total',
          stops: '1 stop (Dubai DXB)',
          transitCountry: 'UAE',
          transitVisaRequiredForNG: false,
          transitNotes: 'DXB airside transit requires no transit visa.',
          frequency: 'Daily',
          approxFareUSD: 1320
        }
      ],
      localTransitTip: 'Tokyo Metro and JR Yamanote Line trains stop around 00:30 midnight. Taxis late at night carry a 20% surcharge.',
      rideshareAvailable: true,
      airportToCityCostUSD: 40
    },
    travellerReports: [
      {
        id: 'rep-jp-1',
        author: 'Emeka N.',
        nationalityFlag: '🇳🇬',
        date: '2026-08-11',
        entryPort: 'Tokyo Haneda HND',
        experienceRating: 5,
        title: 'Japan eVisa approved in 8 days, Tokyo is the cleanest city on earth',
        comment: 'Applied on the MOFA Japan eVisa site with my Nigerian passport. Provided hotel bookings, 6 months bank statement, and detailed daily schedule. Showed the eVisa notice on my phone at Haneda immigration. Japanese hospitality (Omotenashi) is extraordinary.',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 73,
        verifiedTrip: true
      }
    ],
    events: [
      { name: 'Kanda Matsuri Festival', date: 'May (odd years)', description: 'One of Tokyo’s three grand Shinto festivals featuring 200 portable shrines parading through Akihabara.' }
    ]
  },
  {
    id: 'kenya',
    name: 'Nairobi & Maasai Mara',
    country: 'Kenya',
    region: 'Africa',
    flag: '🇰🇪',
    tagline: 'The Safari Capital of the World & Silicon Savannah',
    overview: 'Nairobi is the only global capital city adjoining a wildlife national park with wild lions, while the Maasai Mara hosts the Great Migration, one of nature’s most spectacular wonders.',
    heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80',
    ],
    categoryTags: ['Safari', 'Wildlife', 'Nature', 'Culture', 'Adventure'],
    bestSeason: 'July to October (Great Migration) & January to February',
    weatherSummary: 'Pleasant high-altitude climate. Nairobi averages 24°C daytime. Maasai Mara nights can be chilly (12°C).',
    currencyCode: 'KES',
    currencySymbol: 'KSh',
    exchangeRateToUSD: 129,
    dailyBudgetEstimateUSD: { budget: 50, moderate: 140, luxury: 420 },
    lastVerifiedDate: '2026-09-05',
    isTrending: true,
    entryRulesByPassport: {
      NG: createRule(
        'eTA',
        '90 Days',
        35,
        '24 - 72 hours',
        'Kenya has abolished traditional visas in favor of the Electronic Travel Authorisation (eTA). Apply online at etakenya.go.ke before travel.',
        ['Passport valid min 6 months', 'Recent passport photo', 'Confirmed hotel/lodge bookings', 'Flight itinerary', 'Credit card for $35 processing fee'],
        '$500 proof of funds',
        true,
        'Direct 5h 30m flights via Kenya Airways from Lagos (LOS) to Nairobi (NBO).',
        'Department of Immigration Services Kenya',
        'OFFICIAL',
        'https://www.etakenya.go.ke'
      ),
      KE: createRule('Visa-Free', 'Unlimited', 0, 'Citizen', 'Citizen right of residence.', ['Kenyan National ID or Passport'], 'N/A', false, 'Domestic travel', 'Immigration Kenya', 'OFFICIAL'),
      GH: createRule('eTA', '90 Days', 35, '24 - 48 hours', 'eTA required for all visitors prior to departure.', ['Passport', 'Flight', 'Hotel'], 'N/A', true, 'Kenya Airways direct Accra-Nairobi', 'Kenya eTA', 'OFFICIAL'),
      ZA: createRule('Visa-Free', '90 Days', 0, 'Instant', 'South African passport holders are visa-exempt for 90 days tourism.', ['Passport', 'Return ticket'], 'Subsistence check', false, 'Direct flights JNB-NBO', 'Kenya Immigration', 'OFFICIAL'),
      RW: createRule('Visa-Free', 'Unlimited', 0, 'Instant', 'EAC free movement with National ID.', ['Rwandan ID / Passport'], 'N/A', false, 'Direct RwandAir Kigali-Nairobi', 'EAC', 'OFFICIAL'),
      GB: createRule('eTA', '90 Days', 35, '24 - 48 hours', 'All British citizens must obtain an approved eTA.', ['UK Passport', 'Accommodation proof'], 'Credit card', false, 'Direct British Airways & Kenya Airways London-Nairobi', 'Kenya eTA', 'OFFICIAL'),
      US: createRule('eTA', '90 Days', 35, '24 - 48 hours', 'Electronic Travel Authorisation required.', ['US Passport', 'eTA approval PDF'], 'Credit card', false, 'Direct Kenya Airways flight New York JFK to Nairobi NBO', 'Kenya eTA', 'OFFICIAL'),
      CA: createRule('eTA', '90 Days', 35, '24 - 48 hours', 'Apply for eTA online.', ['Canadian Passport', 'eTA confirmation'], 'Credit card', false, 'Via London or European hubs', 'Kenya eTA', 'OFFICIAL'),
      FR: createRule('eTA', '90 Days', 35, '24 - 48 hours', 'eTA obligatoire avant embarquement.', ['Passeport', 'Formulaire eTA validé'], 'Carte de crédit', false, 'Direct Air France / Kenya Airways Paris-Nairobi', 'Kenya eTA', 'OFFICIAL'),
      IN: createRule('eTA', '90 Days', 35, '24 - 48 hours', 'eTA required online.', ['Indian Passport', 'Yellow fever card', 'Hotel booking'], '$500', true, 'Direct Air India / Kenya Airways from Mumbai', 'Kenya eTA', 'OFFICIAL'),
    },
    realityChecks: [
      {
        id: 'rc-ke-1',
        topic: 'Kenya eTA Processing Times & Fake Scam Websites',
        officialPolicy: 'Official portal (etakenya.go.ke) charges $35 and states 72 hours processing.',
        travellerReality: 'Multiple predatory mirror websites charge $120+ for fake eTA applications. Make sure the URL ends strictly in ".go.ke". Apply at least 5 days in advance, as weekend submissions often stall until Monday morning.',
        officialSource: 'Kenya Directorate of Immigration Services Alert',
        communitySource: '67 verified travellers on IJEORA',
        reportCount: 67,
        lastReportedDate: '2026-09-09',
        confidenceRating: 99,
        status: 'active',
      }
    ],
    attractions: [
      {
        id: 'att-maasai-mara',
        name: 'Maasai Mara National Reserve & Great Migration',
        category: 'Safari',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 100,
        openingHours: '06:00 - 18:30',
        bestTime: 'Sunrise game drives & Mara River crossings (July - October)',
        recommendedDuration: '3 - 4 days',
        location: 'Narok County, Southwest Kenya',
        tips: 'Fly in via bush plane from Wilson Airport (WIL) directly to Mara airstrips to avoid 6-hour bumpy road transfer.',
        travellerExperience: 'Witnessing 1.5 million wildebeest, zebras, and apex predators across open savannah plains.'
      }
    ],
    hotels: [
      {
        id: 'ht-giraffe-manor',
        name: 'Giraffe Manor (The Safari Collection)',
        category: 'Luxury',
        pricePerNightUSD: 950,
        rating: 4.9,
        reviewsCount: 140,
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Iconic Wildlife', 'Couples', 'Luxury Heritage'],
        distanceFromCenter: 'Karen suburb, Nairobi',
        highlights: ['Resident endangered Rothschild giraffes poking heads into breakfast windows', '1930s manor grandeur']
      }
    ],
    foodAndCulture: [
      {
        name: 'Nyama Choma with Kachumbari & Ugali',
        type: 'Dish',
        description: 'Tender fire-roasted goat or beef served with fresh diced tomato, onion, and chili relish.',
        avgCostUSD: 7,
        mustTryLocation: 'Carnivore Restaurant or local joints in Kenyatta Market',
        culturalNote: 'M-Pesa mobile money is king in Kenya. Even roadside fruit vendors accept M-Pesa. Travellers can register a temporary Safaricom tourist SIM at JKIA.'
      }
    ],
    routes: {
      primaryAirport: 'Jomo Kenyatta International Airport',
      code: 'NBO',
      routesFromAfrica: [
        {
          airline: 'Kenya Airways',
          departureHub: 'Lagos (LOS) / Accra (ACC) / Johannesburg (JNB)',
          flightDuration: '5h 30m',
          stops: 'Direct non-stop',
          transitCountry: 'None',
          transitVisaRequiredForNG: false,
          transitNotes: 'Direct non-stop service into Terminal 1A.',
          frequency: 'Daily',
          approxFareUSD: 650
        }
      ],
      localTransitTip: 'Use Uber or Bolt in Nairobi for safe transparent pricing. The Nairobi Expressway bypasses city traffic to Karen and Westlands in 15 mins.',
      rideshareAvailable: true,
      airportToCityCostUSD: 18
    },
    travellerReports: [
      {
        id: 'rep-ke-1',
        author: 'Babajide A.',
        nationalityFlag: '🇳🇬',
        date: '2026-08-22',
        entryPort: 'Nairobi JKIA',
        experienceRating: 5,
        title: 'eTA approved in 24 hours, Nairobi is vibrant and green',
        comment: 'Got my eTA approved next day. Immigration at JKIA scanned the barcode from my phone. Took an Uber straight to Karen. Maasai Mara safari was the best trip of my life.',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 44,
        verifiedTrip: true
      }
    ],
    events: [
      { name: 'Nairobi Restaurant Week', date: 'January / February', description: 'Top chefs across Nairobi offer multi-course tasting menus celebrating modern African cuisine.' }
    ]
  },
  {
    id: 'rwanda',
    name: 'Kigali & Volcanoes',
    country: 'Rwanda',
    region: 'Africa',
    flag: '🇷🇼',
    tagline: 'The Land of a Thousand Hills & Mountain Gorillas',
    overview: 'Celebrated as the cleanest, safest, and most progressive city in Africa, Kigali offers vibrant art hubs and rolling green ridges, leading to the mist-shrouded peaks where endangered mountain gorillas roam.',
    heroImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80',
    ],
    categoryTags: ['Culture', 'Safety', 'Wildlife', 'Nature', 'Cleanest City'],
    bestSeason: 'June to September & December to February (dry seasons for gorilla trekking)',
    weatherSummary: 'Moderate subtropical mountain climate averaging 22°C - 26°C all year thanks to altitude.',
    currencyCode: 'RWF',
    currencySymbol: 'FRw',
    exchangeRateToUSD: 1380,
    dailyBudgetEstimateUSD: { budget: 45, moderate: 120, luxury: 350 },
    lastVerifiedDate: '2026-09-04',
    isTrending: false,
    entryRulesByPassport: {
      NG: createRule(
        'Visa on Arrival',
        '30 Days',
        0,
        'Instant at airport gate',
        'Rwanda grants free 30-day Visa on Arrival to all citizens of the African Union, Commonwealth, and La Francophonie (including Nigeria)! No advance visa fee or paperwork needed.',
        ['Passport valid min 6 months', 'Return ticket', 'Confirmed hotel reservation'],
        'Not strictly audited',
        true,
        'Direct flights on RwandAir from Lagos (LOS) and Abuja (ABV) non-stop to Kigali (KGL).',
        'Directorate General of Immigration and Emigration Rwanda',
        'OFFICIAL',
        'https://www.migration.gov.rw'
      ),
      KE: createRule('Visa-Free', '6 Months', 0, 'Instant', 'Free movement within EAC. National ID card accepted.', ['Kenyan National ID or Passport'], 'N/A', false, 'Direct flight Kenya Airways / RwandAir', 'EAC', 'OFFICIAL'),
      GH: createRule('Visa on Arrival', '30 Days', 0, 'Instant', 'Free 30-day visa on arrival for African Union citizens.', ['Ghanaian Passport', 'Return flight'], 'N/A', true, 'RwandAir direct Accra-Kigali', 'Rwanda Gov', 'OFFICIAL'),
      ZA: createRule('Visa on Arrival', '30 Days', 0, 'Instant', 'Free 30-day visa on arrival for South Africans.', ['Passport', 'Return ticket'], 'N/A', false, 'RwandAir direct JNB-KGL', 'Rwanda Gov', 'OFFICIAL'),
      RW: createRule('Visa-Free', 'Unlimited', 0, 'Citizen', 'Citizen residence.', ['National ID'], 'N/A', false, 'Home country', 'Gov Rwanda', 'OFFICIAL'),
      GB: createRule('Visa on Arrival', '30 Days', 0, 'Instant', 'Commonwealth citizens receive 30-day visa on arrival free of charge.', ['UK Passport', 'Return ticket'], 'N/A', false, 'RwandAir direct London Heathrow to Kigali', 'Rwanda Immigration', 'OFFICIAL'),
      US: createRule('Visa on Arrival', '30 Days', 50, 'Instant', '30-day tourist visa on arrival for US citizens ($50 USD payable by card/cash).', ['US Passport', 'Return ticket'], 'Adequate funds', false, 'Via Doha or European hubs', 'Rwanda Immigration', 'OFFICIAL'),
      CA: createRule('Visa on Arrival', '30 Days', 0, 'Instant', 'Commonwealth member exemption: free 30-day visa on arrival.', ['Canadian Passport', 'Return ticket'], 'N/A', false, 'Via Brussels or Doha', 'Rwanda Immigration', 'OFFICIAL'),
      FR: createRule('Visa on Arrival', '30 Days', 0, 'Instant', 'Membres de la Francophonie : visa gratuit 30 jours à l’arrivée.', ['Passeport', 'Billet retour'], 'N/A', false, 'Vols directs RwandAir Paris CDG à Kigali', 'Rwanda Gov', 'OFFICIAL'),
      IN: createRule('Visa on Arrival', '30 Days', 0, 'Instant', 'Commonwealth exemption: free 30-day visa on arrival for Indian passport holders.', ['Indian Passport', 'Yellow fever card', 'Return flight'], 'N/A', true, 'Via Addis Ababa or Doha', 'Rwanda Gov', 'OFFICIAL'),
    },
    realityChecks: [
      {
        id: 'rc-rw-1',
        topic: 'Umuganda Community Work Day & Plastic Bag Ban Enforcement',
        officialPolicy: 'Non-biodegradable polythene plastic bags are banned in Rwanda. Border customs confiscate plastic bags. Last Saturday of every month (Umuganda) sees businesses pause until 11:00 AM.',
        travellerReality: 'Airport customs at KGL will inspect your luggage and confiscate clear plastic shopping bags or duty-free polythene bags. Pack with cloth/ziploc pouches. Taxi drivers and shops are super respectful.',
        officialSource: 'Rwanda Environment Management Authority (REMA)',
        communitySource: '38 verified travellers on IJEORA',
        reportCount: 38,
        lastReportedDate: '2026-08-25',
        confidenceRating: 98,
        status: 'active',
      }
    ],
    attractions: [
      {
        id: 'att-kigali-memorial',
        name: 'Kigali Genocide Memorial & Rose Garden',
        category: 'Historical',
        image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 0,
        openingHours: '08:00 - 17:00 daily',
        bestTime: 'Morning quiet reflection',
        recommendedDuration: '2 - 3 hours',
        location: 'Gisozi, Kigali',
        tips: 'Audio guide ($15 donation) provides powerful firsthand survivor testimony.',
        travellerExperience: 'Deeply moving, humbling, and inspiring testament to national reconciliation and resilience.'
      }
    ],
    hotels: [
      {
        id: 'ht-kigali-serena',
        name: 'Kigali Serena Hotel',
        category: 'Luxury',
        pricePerNightUSD: 240,
        rating: 4.8,
        reviewsCount: 310,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Diplomatic Luxury', 'Pool', 'Central Boulevard Location'],
        distanceFromCenter: 'Kiyovu diplomatic quarter',
        highlights: ['Olympic swimming pool', 'Milima restaurant', 'Private garden terrace']
      }
    ],
    foodAndCulture: [
      {
        name: 'Brochettes (Grilled Beef/Goat Skewers) with Ibirayi',
        type: 'Dish',
        description: 'Tender marinated meat skewers grilled over charcoal, served with roasted spiced Rwandan potatoes.',
        avgCostUSD: 4,
        mustTryLocation: 'Papyrus Restaurant in Kimihurura or local milk bars',
        culturalNote: 'Motorcycle taxis (Motos) in Kigali are mandatory helmet-wearing, metered, and exceptionally safe. Kigali is frequently ranked Africa’s safest walking city.'
      }
    ],
    routes: {
      primaryAirport: 'Kigali International Airport',
      code: 'KGL',
      routesFromAfrica: [
        {
          airline: 'RwandAir',
          departureHub: 'Lagos (LOS) / Abuja (ABV) / Accra (ACC)',
          flightDuration: '4h 15m',
          stops: 'Direct non-stop',
          transitCountry: 'None',
          transitVisaRequiredForNG: false,
          transitNotes: 'Direct non-stop flights 4x weekly on modern Airbus A330.',
          frequency: '4x weekly',
          approxFareUSD: 590
        }
      ],
      localTransitTip: 'Yego Moto or Move by Volkswagen app provides safe, fixed-fare rides around Kigali.',
      rideshareAvailable: true,
      airportToCityCostUSD: 12
    },
    travellerReports: [
      {
        id: 'rep-rw-1',
        author: 'Nneka E.',
        nationalityFlag: '🇳🇬',
        date: '2026-08-30',
        entryPort: 'Kigali Airport KGL',
        experienceRating: 5,
        title: 'Zero visa fee for Nigerians! Walked through in 3 minutes',
        comment: 'I still cannot believe how seamless it was. Handed over my Nigerian passport, officer smiled, stamped 30 days for free, and welcomed me to Rwanda. The city is spotless. No litter anywhere!',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 89,
        verifiedTrip: true
      }
    ],
    events: [
      { name: 'Kwita Izina (Gorilla Naming Ceremony)', date: 'September annually', description: 'World-renowned conservation celebration in Kinigi naming newborn mountain gorillas.' }
    ]
  },
  {
    id: 'uae',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    flag: '🇦🇪',
    tagline: 'Futuristic Architecture, Golden Dunes & High-Octane Luxury',
    overview: 'From the dizzying heights of the Burj Khalifa to the sensory aromas of the Old Dubai spice souks and world-class culinary entertainment.',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80',
    ],
    categoryTags: ['Luxury', 'Architecture', 'Shopping', 'Nightlife', 'Food'],
    bestSeason: 'November to April (cool winter months)',
    weatherSummary: 'Sunny desert climate. Winters are ideal (24°C - 28°C). Summers reach 42°C+ with air-conditioned indoor experiences.',
    currencyCode: 'AED',
    currencySymbol: 'AED',
    exchangeRateToUSD: 3.67,
    dailyBudgetEstimateUSD: { budget: 90, moderate: 240, luxury: 700 },
    lastVerifiedDate: '2026-09-06',
    isTrending: true,
    entryRulesByPassport: {
      NG: createRule(
        'Visa Required',
        '30 or 60 Days',
        170,
        '5 - 10 working days',
        'Tourist visa required via official UAE Immigration / GDRFA or accredited airline/hotel sponsor. Verification requires document verification number (DVN) and strict bank requirements.',
        ['Passport valid min 6 months', '6 months verifiable bank statements with minimum $10,000 balance equivalent', 'Confirmed return flight ticket on Emirates/FlyDubai or partner', 'Confirmed hotel reservation', 'Clear passport bio page scan', 'NIN document verification number'],
        'Minimum $10,000 USD verifiable 6-month average balance',
        false,
        'Direct flights on Emirates from Lagos (LOS) to Dubai (DXB).',
        'General Directorate of Residency and Foreigners Affairs Dubai (GDRFA)',
        'OFFICIAL',
        'https://gdrfad.gov.ae'
      ),
      KE: createRule('eVisa', '30 Days', 110, '3 - 5 days', 'eVisa via GDRFA or Emirates airline sponsorship.', ['Passport', 'Return ticket', 'Bank statement'], '$3,000', false, 'Direct Kenya Airways & Emirates from Nairobi', 'GDRFA', 'OFFICIAL'),
      GH: createRule('Visa Required', '30 Days', 150, '5 - 7 days', 'Tourist visa application required via sponsor.', ['Passport', 'Return ticket', 'Hotel booking', 'Bank statement'], '$5,000', false, 'Emirates direct Accra-Dubai', 'GDRFA', 'OFFICIAL'),
      ZA: createRule('eVisa', '30 Days', 100, '3 days', 'Apply online via Emirates/FlyDubai or VFS Dubai.', ['Passport', 'Proof of funds'], '$2,000', false, 'Emirates direct JNB-DXB', 'GDRFA', 'OFFICIAL'),
      RW: createRule('eVisa', '30 Days', 110, '3 days', 'eVisa via GDRFA or RwandAir partnership.', ['Passport', 'Hotel voucher'], '$2,000', false, 'Direct RwandAir Kigali-Dubai', 'GDRFA', 'OFFICIAL'),
      GB: createRule('Visa-Free', '30 Days', 0, 'Instant', 'Free 30-day visa on arrival for British passport holders.', ['UK Passport', 'Return flight'], 'Credit card', false, 'Multiple daily direct flights', 'UAE Gov', 'OFFICIAL'),
      US: createRule('Visa-Free', '30 Days', 0, 'Instant', 'Free 30-day visa on arrival for US citizens.', ['US Passport', 'Return flight'], 'Credit card', false, 'Daily direct flights', 'UAE Gov', 'OFFICIAL'),
      CA: createRule('Visa-Free', '30 Days', 0, 'Instant', 'Free 30-day visa on arrival for Canadian citizens.', ['Canadian Passport'], 'Credit card', false, 'Direct Emirates & Air Canada', 'UAE Gov', 'OFFICIAL'),
      FR: createRule('Visa-Free', '90 Days', 0, 'Instant', 'Visa gratuit de 90 jours à l’arrivée.', ['Passeport'], 'Carte bancaire', false, 'Vols directs Air France / Emirates', 'UAE Gov', 'OFFICIAL'),
      IN: createRule('Visa on Arrival', '14 Days', 35, 'Instant', 'Indian passport holders with valid US/UK/Schengen visa or green card receive 14-day visa on arrival at DXB.', ['Indian Passport', 'Valid US/UK/Schengen visa'], 'Credit card', false, 'Multiple flights daily from all Indian metros', 'UAE ICP', 'OFFICIAL'),
    },
    realityChecks: [
      {
        id: 'rc-uae-1',
        topic: 'Nigerian Tourist Visa Approval Reality & DVN Verification',
        officialPolicy: 'UAE resumed tourist visa issuance for Nigerian nationals subject to document verification and minimum bank balance requirements.',
        travellerReality: 'Ensure your Document Verification Number (DVN) is generated through the authorized portal before submitting your visa through Emirates or licensed agencies. Applications without verifiable bank statements of at least $10,000 USD balance face high rejection rates. Do not book non-refundable flights until visa approval is confirmed in hand.',
        officialSource: 'Federal Authority for Identity, Citizenship, Customs and Port Security (ICP)',
        communitySource: '96 verified traveller reports on IJEORA',
        reportCount: 96,
        lastReportedDate: '2026-09-13',
        confidenceRating: 97,
        status: 'active',
      }
    ],
    attractions: [
      {
        id: 'att-burj-khalifa',
        name: 'Burj Khalifa & Dubai Mall Fountain Show',
        category: 'Architecture',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        typicalCostUSD: 48,
        openingHours: '08:30 - 23:00',
        bestTime: '17:30 sunset slot at Level 124/125',
        recommendedDuration: '2 hours',
        location: 'Downtown Dubai',
        tips: 'Combine with the free evening fountain choreographed show outside every 30 minutes after 18:00.',
        travellerExperience: 'Looking down from the tallest building in human history as desert horizon meets the Arabian Gulf.'
      }
    ],
    hotels: [
      {
        id: 'ht-atlantis-royal',
        name: 'Atlantis The Royal, Palm Jumeirah',
        category: 'Luxury',
        pricePerNightUSD: 780,
        rating: 4.9,
        reviewsCount: 380,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        goodFor: ['Ultra-Luxury', 'Cloud 22 Sky Pool', 'Celebrity Restaurants'],
        distanceFromCenter: 'Crescent of Palm Jumeirah',
        highlights: ['Cloud 22 rooftop sky pool', 'Nobu by the Beach', 'Private beach access']
      }
    ],
    foodAndCulture: [
      {
        name: 'Shawarma & Karak Chai in Deira',
        type: 'Street Food',
        description: 'Slow-roasted spiced chicken wrapped in saj flatbread with garlic toum, pickles, and crispy fries, washed down with spiced cardamom milk tea.',
        avgCostUSD: 3.5,
        mustTryLocation: 'Al Mallah on 2nd December Street or Deira Old Souk',
        culturalNote: 'Dubai is extremely safe and cosmopolitan, but respect local laws regarding public affection and modest dress in government offices.'
      }
    ],
    routes: {
      primaryAirport: 'Dubai International Airport',
      code: 'DXB',
      routesFromAfrica: [
        {
          airline: 'Emirates',
          departureHub: 'Lagos (LOS) / Accra (ACC) / Nairobi (NBO) / JNB',
          flightDuration: '7h 15m',
          stops: 'Direct non-stop',
          transitCountry: 'None',
          transitVisaRequiredForNG: false,
          transitNotes: 'Direct non-stop into Terminal 3.',
          frequency: 'Daily',
          approxFareUSD: 980
        }
      ],
      localTransitTip: 'Dubai Metro Red Line is world-class, driverless, and connects directly from DXB Airport to Downtown and Dubai Marina.',
      rideshareAvailable: true,
      airportToCityCostUSD: 25
    },
    travellerReports: [
      {
        id: 'rep-uae-1',
        author: 'Farouk M.',
        nationalityFlag: '🇳🇬',
        date: '2026-08-18',
        entryPort: 'Dubai DXB Terminal 3',
        experienceRating: 5,
        title: 'Visa approved through Emirates, smooth entry at DXB',
        comment: 'Applied through Emirates ticketing with my verified 6-month bank statement and hotel voucher. Approved in 6 days. At DXB, e-gates scanned my biometric passport and I was through in 20 seconds.',
        trustLevel: 'COMMUNITY',
        helpfulVotes: 68,
        verifiedTrip: true
      }
    ],
    events: [
      { name: 'Dubai Shopping Festival (DSF)', date: 'December to January', description: 'Massive shopping discounts, daily fireworks, and celebrity concerts across the emirate.' }
    ]
  }
];

import { generateGlobalDestinations } from './globalCountryDataset';
import { generateAdditionalDestinations } from './allWorldCountries';
import { generateSovereignRegistryDestinations } from './worldCountryRegistry';

const existingIds = new Set<string>();
const combinedDestinations: Destination[] = [];

function addUniqueDestinations(list: Destination[], defaultLiveIntel = false) {
  for (const item of list) {
    if (!existingIds.has(item.id)) {
      existingIds.add(item.id);
      combinedDestinations.push({
        ...item,
        hasLiveIntel: item.hasLiveIntel !== undefined ? item.hasLiveIntel : defaultLiveIntel,
      });
    }
  }
}

// 1. Deep prototype destinations (with verified live field agent intelligence)
addUniqueDestinations(DOMESTIC_DESTINATIONS, true);
addUniqueDestinations(INTERNATIONAL_DESTINATIONS, true);

// 2. Global Country Database (195+ sovereign countries, states, territories worldwide)
addUniqueDestinations(generateGlobalDestinations(), false);
addUniqueDestinations(generateAdditionalDestinations(), false);
addUniqueDestinations(generateSovereignRegistryDestinations(), false);

export const DESTINATIONS: Destination[] = combinedDestinations;

