import { Destination, PassportCode, EntryRule, TravelPurpose, TrustLevel } from '../types';
import { PASSPORT_OPTIONS } from '../data/passports';

export interface PracticalPathway14Questions {
  canIEnter: {
    verdict: 'YES' | 'CONDITIONALLY' | 'VISA_REQUIRED' | 'CITIZEN_RIGHT';
    headline: string;
    practicalSummary: string; // Plain-English translation
  };
  doINeedAVisa: {
    statusText: string;
    isExempt: boolean;
    explanation: string;
  };
  doINeedAnETA: {
    required: boolean;
    type: string;
    systemName: string;
    feeUSD: number;
    portalUrl?: string;
    leadTime: string;
    explanation: string;
  };
  doINeedOnlineRegistration: {
    required: boolean;
    systemName: string;
    deadline: string;
    explanation: string;
    portalUrl?: string;
  };
  whatHappensWhenIArrive: {
    arrivalPermitType: string;
    validityDuration: string;
    stepByStep: string[];
    conditions: string[];
  };
  whatDocumentsDoINeed: {
    passportValidityMonths: number;
    blankPagesRequired: number;
    returnTicketRequired: boolean;
    accommodationProofRequired: boolean;
    proofOfFundsText: string;
    mandatoryChecklist: string[];
  };
  areThereHealthRequirements: {
    yellowFeverRequired: boolean;
    yellowFeverDetails: string;
    insuranceMandatory: boolean;
    insuranceMinCoverage?: string;
    healthDeclarationRequired: boolean;
    additionalNotes: string;
  };
  areThereTransitRequirements: {
    airsideTransitVisaRequired: boolean;
    transitType: string;
    commonRouteHubs: string;
    transitWarning: string;
  };
  howDoIApply: {
    stepByStepProcedure: string;
    applicationLink?: string;
    recommendedSubmissionWindow: string;
  };
  whatDoesItCost: {
    visaFeeUSD: number;
    preAuthFeeUSD: number;
    arrivalFeeUSD: number;
    totalUSD: number;
    currencyNote: string;
  };
  howLongDoesItTake: {
    processingTimeDays: string;
    expeditedAvailable: boolean;
  };
  whatAreTheConditions: {
    maxDuration: string;
    prohibitedActivities: string[];
    mandatoryConditions: string[];
  };
  whatIsTheOfficialSource: {
    sourceName: string;
    officialAuthority: string;
    sourceType: TrustLevel;
    datePublished?: string;
  };
  whenWasItVerified: {
    lastVerifiedDate: string;
    isStale: boolean;
    isLiveAvailable: boolean;
    isDemoData: boolean;
    reverificationNotice?: string;
  };
}

/**
 * Resolves the 14-point Practical Entry Pathway for any destination and passport combination.
 * Strictly guarantees that Visa Status != Complete Entry Requirements.
 */
export function resolvePracticalEntryPathway(
  destination: Destination,
  passportCode: PassportCode,
  purpose: TravelPurpose = 'Tourism / Leisure'
): PracticalPathway14Questions {
  const rule: EntryRule = destination.entryRulesByPassport[passportCode] || {
    status: 'Visa Required',
    stayDuration: '30 Days',
    passportValidityMonths: 6,
    blankPagesRequired: 2,
    feeEstimateUSD: 80,
    processingTimeDays: '7 - 14 business days',
    requiredDocuments: ['Valid Passport', 'Return Flight Ticket', 'Hotel Reservation Voucher', '3 Months Bank Statements'],
    proofOfFunds: '$100/day minimum funds',
    returnTicketRequired: true,
    accommodationProofRequired: true,
    healthRequirements: { yellowFeverRequired: false, insuranceMandatory: true },
    transitNotes: 'Verify airport transit visa if connecting through Schengen, UK, or Middle Eastern hubs.',
    applicationProcedure: 'Submit application via designated consular authority or official portal.',
    lastVerifiedDate: destination.lastVerifiedDate || '2026-08-15',
    source: 'International Immigration Authority',
    trustLevel: 'OFFICIAL',
  };

  const isDomestic = destination.isDomestic || (passportCode === 'NG' && destination.country.toLowerCase() === 'nigeria');
  const passportMeta = PASSPORT_OPTIONS.find((p) => p.code === passportCode) || PASSPORT_OPTIONS[0];

  // Specific bespoke handlings for key destinations
  const destNameLower = destination.name.toLowerCase();
  const countryLower = destination.country.toLowerCase();

  // 1. SEYCHELLES 🇸🇨 (Bespoke Product Model)
  if (countryLower.includes('seychelles') || destNameLower.includes('seychelles')) {
    const isAfricanOrWestern = true; // Seychelles is visa-free for all nationalities
    return {
      canIEnter: {
        verdict: 'CONDITIONALLY',
        headline: 'Visa Not Required • Mandatory Pre-Travel Authorisation (ETA) Prior to Departure',
        practicalSummary: 'You can travel without a visa, but you must complete the required pre-travel authorisation (SEBS) before departure, hold confirmed accommodation at a certified establishment, and receive your Visitor\'s Permit upon arrival.',
      },
      doINeedAVisa: {
        statusText: 'Visa Not Required (Universal Visa-Free Policy)',
        isExempt: true,
        explanation: 'Seychelles operates a universal visa-free regime for genuine tourists of all nationalities, including Nigeria, Ghana, Kenya, UK, US, and EU.',
      },
      doINeedAnETA: {
        required: true,
        type: 'ETA / Pre-Travel Authorisation',
        systemName: 'Seychelles Electronic Border System (SEBS) / Travel Authorisation',
        feeUSD: 11, // Standard €10 / ~11 USD
        portalUrl: 'https://seychelles.govtas.com',
        leadTime: 'Between 72 hours and 12 hours before scheduled departure flight',
        explanation: 'Mandatory for all inbound passengers. You will receive an approved digital barcode / QR document that airline staff MUST verify at check-in before issuing boarding passes.',
      },
      doINeedOnlineRegistration: {
        required: true,
        systemName: 'Seychelles Electronic Border Health & Immigration Portal',
        deadline: 'Mandatory before airport check-in counter closes',
        explanation: 'Upload flight confirmation, passport bio-page scan, and licensed accommodation voucher.',
      },
      whatHappensWhenIArrive: {
        arrivalPermitType: 'Visitor\'s Permit on Arrival',
        validityDuration: 'Initially granted for up to 30 days (extendable up to 3 months)',
        stepByStep: [
          'Disembark at Seychelles International Airport (SEZ), Mahé.',
          'Present your digital or printed Travel Authorisation (SEBS) QR code to Port Health & Border Control.',
          'Undergo biometric and passport verification at border gate.',
          'Visitor\'s Permit is stamped into your passport free of charge for the approved itinerary duration.'
        ],
        conditions: [
          'Strictly no employment or paid work allowed on a Visitor\'s Permit.',
          'Must stay at an officially licensed tourism establishment certified by the Ministry of Tourism.',
          'Return flight ticket within the permitted stay is strictly enforced.'
        ]
      },
      whatDocumentsDoINeed: {
        passportValidityMonths: 6,
        blankPagesRequired: 2,
        returnTicketRequired: true,
        accommodationProofRequired: true,
        proofOfFundsText: 'Minimum $150 USD per day of stay in cash or international credit card.',
        mandatoryChecklist: [
          'Valid Passport (valid for entire planned stay + 6 months recommended)',
          'Approved Seychelles Travel Authorisation (SEBS QR Code)',
          'Confirmed Return or Onward Flight Ticket',
          'Confirmed Booking Voucher at a Certified Hotel / Guesthouse',
          'Proof of Sufficient Funds ($150/day minimum equivalent)',
          'Yellow Fever Card (if departing from or transiting endemic country >12h)'
        ]
      },
      areThereHealthRequirements: {
        yellowFeverRequired: passportCode === 'NG' || passportCode === 'GH' || passportCode === 'KE',
        yellowFeverDetails: 'Yellow Fever Vaccination Yellow Card is MANDATORY for travellers arriving from or having transited for more than 12 hours through a country with risk of yellow fever transmission.',
        insuranceMandatory: true,
        insuranceMinCoverage: 'Comprehensive international travel medical insurance with repatriation',
        healthDeclarationRequired: true,
        additionalNotes: 'Integrated directly into the online Travel Authorisation submission.'
      },
      areThereTransitRequirements: {
        airsideTransitVisaRequired: false,
        transitType: 'Route Dependent',
        commonRouteHubs: 'Ethiopian Airlines via Addis Ababa (ADD), Qatar Airways via Doha (DOH), Emirates via Dubai (DXB), or Kenya Airways via Nairobi (NBO).',
        transitWarning: 'Airside transit under 24 hours in Addis Ababa, Doha, or Dubai does NOT require a transit visa. Do NOT book split self-transfer tickets requiring baggage re-check outside transit security.'
      },
      howDoIApply: {
        stepByStepProcedure: '1. Book flights and certified hotel.\n2. Visit the official Seychelles Travel Authorisation portal within 72h of departure.\n3. Upload passport bio-data, selfie photo, flight confirmation, and hotel voucher.\n4. Pay €10 fee and receive approved PDF/QR code in your email within 6-12 hours.',
        applicationLink: 'https://seychelles.govtas.com',
        recommendedSubmissionWindow: '48 to 24 hours before flight departure'
      },
      whatDoesItCost: {
        visaFeeUSD: 0,
        preAuthFeeUSD: 11,
        arrivalFeeUSD: 0,
        totalUSD: 11,
        currencyNote: 'Standard processing is €10 (~$11 USD). Urgent 60-minute processing is €75 (~$82 USD).'
      },
      howLongDoesItTake: {
        processingTimeDays: 'Typically 6 to 12 hours (guaranteed within 24 hours)',
        expeditedAvailable: true
      },
      whatAreTheConditions: {
        maxDuration: 'Up to 30 days initially, extendable at Immigration Dept in Victoria up to 3 months.',
        prohibitedActivities: [
          'No gainful employment or commercial services allowed.',
          'Cannot engage in religious proselytizing without permit.'
        ],
        mandatoryConditions: [
          'Must reside exclusively at government-licensed tourist accommodations.',
          'Must maintain sufficient daily subsistence funds.'
        ]
      },
      whatIsTheOfficialSource: {
        sourceName: 'Seychelles Department of Immigration & Civil Status / Ministry of Foreign Affairs',
        officialAuthority: 'Government of Seychelles Immigration and Civil Status Division',
        sourceType: 'OFFICIAL',
        datePublished: '2026-07-01'
      },
      whenWasItVerified: {
        lastVerifiedDate: '2026-09-15',
        isStale: false,
        isLiveAvailable: true,
        isDemoData: true
      }
    };
  }

  // 2. KENYA 🇰🇪 (Mandatory Electronic Travel Authorisation - eTA)
  if (countryLower.includes('kenya') || destNameLower.includes('kenya')) {
    const isEAC = passportCode === 'KE' || passportCode === 'RW';
    const isCitizen = passportCode === 'KE';

    if (isCitizen) {
      return getDomesticCitizenPathway(destination, passportMeta.name);
    }

    return {
      canIEnter: {
        verdict: 'CONDITIONALLY',
        headline: 'Visa Abolished • Mandatory Kenya Electronic Travel Authorisation (eTA) Required',
        practicalSummary: 'Kenya has abolished traditional visas for all visitors. However, ALL travellers must obtain an approved Kenya eTA online at least 72 hours before flight departure.',
      },
      doINeedAVisa: {
        statusText: 'Traditional Visa Abolished (Replaced by Mandatory eTA)',
        isExempt: true,
        explanation: 'The Kenyan government officially replaced paper/eVisa visas with the unified Kenya Electronic Travel Authorisation (eTA).',
      },
      doINeedAnETA: {
        required: true,
        type: 'eTA',
        systemName: 'Republic of Kenya Electronic Travel Authorisation (eTA)',
        feeUSD: 34,
        portalUrl: 'https://www.etakenya.go.ke',
        leadTime: 'At least 72 hours prior to scheduled departure flight',
        explanation: 'Mandatory for all nationalities (except EAC partner state citizens). Must be approved before airline check-in.',
      },
      doINeedOnlineRegistration: {
        required: true,
        systemName: 'Official Kenya eTA System',
        deadline: 'Minimum 3 days prior to travel',
        explanation: 'Submit passport bio-page scan, selfie photo, hotel reservation, and flight itinerary.',
      },
      whatHappensWhenIArrive: {
        arrivalPermitType: 'Biometric Entry Stamp on Arrival',
        validityDuration: 'Up to 90 days for leisure/tourism',
        stepByStep: [
          'Arrive at Jomo Kenyatta International Airport (NBO) or Moi Mombasa (MBA).',
          'Scan approved eTA QR code at automated biometric e-gates or staffed immigration lanes.',
          'Provide finger scans and face image.',
          'Immigration stamps your passport with permitted duration.'
        ],
        conditions: ['No business engagement or employment without specialized work permit.']
      },
      whatDocumentsDoINeed: {
        passportValidityMonths: 6,
        blankPagesRequired: 2,
        returnTicketRequired: true,
        accommodationProofRequired: true,
        proofOfFundsText: '$500 USD liquid funds or valid credit card.',
        mandatoryChecklist: [
          'Passport valid for at least 6 months beyond arrival date',
          'Approved Kenya eTA Confirmation Slip / Digital QR',
          'Return or Onward Airline Ticket',
          'Confirmed Hotel Booking or Invitation Letter from Kenyan Resident',
          'Yellow Fever Card (Mandatory for travelers arriving from Nigeria or Ghana)'
        ]
      },
      areThereHealthRequirements: {
        yellowFeverRequired: passportCode === 'NG' || passportCode === 'GH',
        yellowFeverDetails: 'Strictly checked at NBO port health counters for all travellers arriving from or transiting through yellow fever endemic zones.',
        insuranceMandatory: true,
        insuranceMinCoverage: 'Travel medical insurance recommended',
        healthDeclarationRequired: false,
        additionalNotes: 'Port health checks yellow card validity (must be administered >10 days before arrival).'
      },
      areThereTransitRequirements: {
        airsideTransitVisaRequired: false,
        transitType: 'None',
        commonRouteHubs: 'Direct flights from Lagos (LOS) on Kenya Airways, or connections via Addis Ababa (ADD) or Kigali (KGL).',
        transitWarning: 'Airside transit at NBO under 24 hours does not require eTA if remaining in the international departures lounge.'
      },
      howDoIApply: {
        stepByStepProcedure: '1. Access official portal www.etakenya.go.ke.\n2. Fill personal and travel details.\n3. Upload photo, passport scan, and hotel booking.\n4. Pay $34 USD processing fee via card.\n5. Download approved PDF.',
        applicationLink: 'https://www.etakenya.go.ke',
        recommendedSubmissionWindow: '5 to 7 days before departure'
      },
      whatDoesItCost: {
        visaFeeUSD: 0,
        preAuthFeeUSD: 34,
        arrivalFeeUSD: 0,
        totalUSD: 34,
        currencyNote: 'Fixed standard government eTA fee of $34 USD.'
      },
      howLongDoesItTake: {
        processingTimeDays: 'Normally 24 to 72 hours',
        expeditedAvailable: false
      },
      whatAreTheConditions: {
        maxDuration: '90 days single entry.',
        prohibitedActivities: ['Commercial trading', 'Employment', 'Internships without special pass'],
        mandatoryConditions: ['Must leave country prior to eTA validity expiration.']
      },
      whatIsTheOfficialSource: {
        sourceName: 'Kenya Directorate of Immigration Services (DIS)',
        officialAuthority: 'Ministry of Interior & National Administration, Kenya',
        sourceType: 'OFFICIAL',
        datePublished: '2026-06-01'
      },
      whenWasItVerified: {
        lastVerifiedDate: '2026-09-12',
        isStale: false,
        isLiveAvailable: true,
        isDemoData: true
      }
    };
  }

  // 3. MAURITIUS 🇲🇺 (Visa-Free + Mandatory All-in-One Digital Form)
  if (countryLower.includes('mauritius') || destNameLower.includes('mauritius')) {
    return {
      canIEnter: {
        verdict: 'CONDITIONALLY',
        headline: 'Visa Not Required (Visa-Free for 90 Days) • Mandatory Digital Travel Form',
        practicalSummary: 'You can travel without a visa for up to 90 days, but you must complete the mandatory Mauritius All-in-One Digital Travel Form before boarding and hold verified hotel bookings.',
      },
      doINeedAVisa: {
        statusText: 'Visa Not Required (90 Days Visa-Free)',
        isExempt: true,
        explanation: 'Citizens of Nigeria, South Africa, UK, US, EU, and many other nations do not require a tourist visa for visits up to 90 days.',
      },
      doINeedAnETA: {
        required: false,
        type: 'None',
        systemName: 'Standard Visa-Free Exemption',
        feeUSD: 0,
        leadTime: 'N/A',
        explanation: 'No traditional ETA fee required. However, the online travel declaration form is mandatory.',
      },
      doINeedOnlineRegistration: {
        required: true,
        systemName: 'Mauritius All-in-One Digital Travel Form (SAFEMauritius)',
        deadline: 'Prior to boarding departure flight',
        portalUrl: 'https://safemauritius.govmu.org',
        explanation: 'Generates a PDF document with QR code containing immigration, customs, and health declarations. You must present this to board and at MRU border control.',
      },
      whatHappensWhenIArrive: {
        arrivalPermitType: 'Visitor\'s Permit Stamped on Arrival',
        validityDuration: 'Up to 90 days for tourist purposes',
        stepByStep: [
          'Land at Sir Seewoosagur Ramgoolam International Airport (MRU).',
          'Present passport and digital All-in-One form QR code at health and immigration desk.',
          'Border officer verifies accommodation voucher and return ticket.',
          'Passport stamped with entry permit free of charge.'
        ],
        conditions: ['Must have confirmed reservations in registered hotels or approved tourist residences.']
      },
      whatDocumentsDoINeed: {
        passportValidityMonths: 6,
        blankPagesRequired: 2,
        returnTicketRequired: true,
        accommodationProofRequired: true,
        proofOfFundsText: 'Minimum $100 USD per person per day of stay.',
        mandatoryChecklist: [
          'Passport valid for period of intended stay + 6 months',
          'Mauritius All-in-One Digital Travel Form (QR code)',
          'Confirmed Return Airline Ticket',
          'Confirmed Hotel or Tourist Villa Reservation',
          'Proof of Sufficient Funds ($100/day minimum in cash/cards)'
        ]
      },
      areThereHealthRequirements: {
        yellowFeverRequired: passportCode === 'NG' || passportCode === 'GH',
        yellowFeverDetails: 'Yellow fever certificate required if arriving from or transiting endemic yellow fever area.',
        insuranceMandatory: true,
        insuranceMinCoverage: 'Travel medical insurance recommended for non-citizens',
        healthDeclarationRequired: true,
        additionalNotes: 'Integrated into the All-in-One Digital Travel Form.'
      },
      areThereTransitRequirements: {
        airsideTransitVisaRequired: false,
        transitType: 'None',
        commonRouteHubs: 'Air Mauritius, Emirates via Dubai (DXB), or Kenya Airways via Nairobi (NBO).',
        transitWarning: 'No transit visa required for airside connections under 24 hours in Dubai, Johannesburg, or Nairobi.'
      },
      howDoIApply: {
        stepByStepProcedure: 'No visa application needed. Fill out the free All-in-One Digital Travel Form at safemauritius.govmu.org before your flight and save the PDF/QR on your mobile device.',
        applicationLink: 'https://safemauritius.govmu.org',
        recommendedSubmissionWindow: '24 to 48 hours before flight'
      },
      whatDoesItCost: {
        visaFeeUSD: 0,
        preAuthFeeUSD: 0,
        arrivalFeeUSD: 0,
        totalUSD: 0,
        currencyNote: 'Completely free of charge.'
      },
      howLongDoesItTake: {
        processingTimeDays: 'Instant online generation (10 minutes)',
        expeditedAvailable: false
      },
      whatAreTheConditions: {
        maxDuration: '90 days maximum per calendar year for tourism.',
        prohibitedActivities: ['Employment or profit-making work in Mauritius.'],
        mandatoryConditions: ['Must present return ticket and hotel voucher.']
      },
      whatIsTheOfficialSource: {
        sourceName: 'Passport and Immigration Office, Mauritius Police Force',
        officialAuthority: 'Prime Minister\'s Office, Republic of Mauritius',
        sourceType: 'OFFICIAL',
        datePublished: '2026-05-15'
      },
      whenWasItVerified: {
        lastVerifiedDate: '2026-09-10',
        isStale: false,
        isLiveAvailable: true,
        isDemoData: true
      }
    };
  }

  // 4. FRANCE 🇫🇷 / SCHENGEN AREA
  if (countryLower.includes('france') || destNameLower.includes('france') || destNameLower.includes('paris')) {
    const isWesternVisaFree = ['GB', 'US', 'CA'].includes(passportCode);
    const isEUCitizen = passportCode === 'FR';

    if (isEUCitizen) {
      return getDomesticCitizenPathway(destination, 'European Union / France');
    }

    if (isWesternVisaFree) {
      return {
        canIEnter: {
          verdict: 'CONDITIONALLY',
          headline: 'Visa Not Required (Schengen 90/180 Rule) • Passport & Biometrics Checked',
          practicalSummary: 'You do not need a Schengen visa for short stays up to 90 days within any 180-day period. Ensure your passport was issued less than 10 years ago and is valid for at least 3 months after departure.',
        },
        doINeedAVisa: {
          statusText: 'Visa Not Required (Short-Stay Schengen Exemption)',
          isExempt: true,
          explanation: 'Exempt for tourism and business stays under 90 days.',
        },
        doINeedAnETA: {
          required: false,
          type: 'None',
          systemName: 'ETIAS (Under Rollout)',
          feeUSD: 0,
          leadTime: 'N/A',
          explanation: 'Standard passport entry; ETIAS electronic authorization will be required once operational.',
        },
        doINeedOnlineRegistration: {
          required: false,
          systemName: 'None',
          deadline: 'N/A',
          explanation: 'No pre-departure registration currently required for visa-exempt Western passport holders.',
        },
        whatHappensWhenIArrive: {
          arrivalPermitType: 'Schengen Border Stamp',
          validityDuration: 'Max 90 days in any 180-day rolling window',
          stepByStep: [
            'Arrive at Paris CDG or Orly (ORY).',
            'Present passport at EU external border control (PARAFE biometric e-gates or staffed booth).',
            'Officer may request proof of accommodation and return ticket.',
            'Passport stamped with entry date.'
          ],
          conditions: ['Strictly maximum 90 days in Schengen zone in any 180-day period.']
        },
        whatDocumentsDoINeed: {
          passportValidityMonths: 3,
          blankPagesRequired: 2,
          returnTicketRequired: true,
          accommodationProofRequired: true,
          proofOfFundsText: '€65 to €120 per day depending on accommodation.',
          mandatoryChecklist: [
            'Passport issued within last 10 years and valid min 3 months after departure',
            'Return or Onward Airline Ticket',
            'Proof of accommodation (Hotel voucher or Attestation d\'Accueil)',
            'Travel health insurance covering min €30,000 medical emergency'
          ]
        },
        areThereHealthRequirements: {
          yellowFeverRequired: false,
          yellowFeverDetails: 'Not required.',
          insuranceMandatory: true,
          insuranceMinCoverage: '€30,000 medical and repatriation coverage',
          healthDeclarationRequired: false,
          additionalNotes: 'Standard international travel health insurance required.'
        },
        areThereTransitRequirements: {
          airsideTransitVisaRequired: false,
          transitType: 'None',
          commonRouteHubs: 'Direct flights or connections via London (LHR), Frankfurt (FRA), Amsterdam (AMS).',
          transitWarning: 'Domestic intra-Schengen connections require entering the Schengen border zone at first port of entry.'
        },
        howDoIApply: {
          stepByStepProcedure: 'No application required. Proceed to airport check-in with valid passport.',
          recommendedSubmissionWindow: 'N/A'
        },
        whatDoesItCost: {
          visaFeeUSD: 0,
          preAuthFeeUSD: 0,
          arrivalFeeUSD: 0,
          totalUSD: 0,
          currencyNote: 'Free entry for visa-exempt travelers.'
        },
        howLongDoesItTake: {
          processingTimeDays: 'Immediate entry stamp at border',
          expeditedAvailable: false
        },
        whatAreTheConditions: {
          maxDuration: '90 days in any 180-day window across all 29 Schengen states.',
          prohibitedActivities: ['No employment in France without a work permit.'],
          mandatoryConditions: ['Must respect 90/180 rule across entire Schengen area.']
        },
        whatIsTheOfficialSource: {
          sourceName: 'France-Visas Official Portal / Ministry of the Interior',
          officialAuthority: 'French Directorate-General for Foreigners in France (DGEF)',
          sourceType: 'OFFICIAL',
          datePublished: '2026-06-15'
        },
        whenWasItVerified: {
          lastVerifiedDate: '2026-09-01',
          isStale: false,
          isLiveAvailable: true,
          isDemoData: true
        }
      };
    }

    // Nigeria, Ghana, Rwanda, India -> Visa Required
    return {
      canIEnter: {
        verdict: 'VISA_REQUIRED',
        headline: 'Visa Required (Schengen Visa Type C) • Mandatory TLScontact / Embassy Application',
        practicalSummary: 'A Schengen Short-Stay Visa (Type C) must be applied for and stamped in your passport prior to booking non-refundable travel. Processing requires biometric appointment and comprehensive documentation.',
      },
      doINeedAVisa: {
        statusText: 'Visa Required (Schengen Short-Stay Visa Type C)',
        isExempt: false,
        explanation: `Citizens holding a ${passportMeta.name} passport must obtain a valid Schengen visa from the Embassy of France or TLScontact center before travel.`,
      },
      doINeedAnETA: {
        required: false,
        type: 'None',
        systemName: 'Visa Overrides ETA',
        feeUSD: 0,
        leadTime: 'N/A',
        explanation: 'ETIAS pre-travel authorization is NOT applicable to visa-required passport holders. Your Schengen visa sticker is your sole entry authorization.',
      },
      doINeedOnlineRegistration: {
        required: true,
        systemName: 'France-Visas Application Portal & TLScontact Appointment Booking',
        deadline: 'At least 15 to 45 business days prior to departure',
        portalUrl: 'https://france-visas.gouv.fr',
        explanation: 'Must complete France-Visas application form, download receipt, and schedule physical biometric appointment at TLScontact Lagos or Abuja.',
      },
      whatHappensWhenIArrive: {
        arrivalPermitType: 'Schengen Border Stamp',
        validityDuration: 'Granted duration specified on visa sticker (e.g. 15 to 90 days)',
        stepByStep: [
          'Land at Paris CDG or Orly (ORY).',
          'Present passport with valid Schengen visa sticker.',
          'French Border Police (PAF) may ask to see proof of accommodation, return ticket, and travel insurance.',
          'Passport stamped with entry date.'
        ],
        conditions: ['Strictly no work permitted; stay must not exceed days specified on visa sticker.']
      },
      whatDocumentsDoINeed: {
        passportValidityMonths: 6,
        blankPagesRequired: 2,
        returnTicketRequired: true,
        accommodationProofRequired: true,
        proofOfFundsText: '6 months stamped official bank statements proving minimum €120/day or €65/day if prepaid hotel.',
        mandatoryChecklist: [
          'Passport valid for at least 3 months beyond intended departure from Schengen',
          'Completed and signed France-Visas application form & receipt',
          'Two compliant biometric passport photographs',
          'Confirmed Return Flight Itinerary (Reservation/Voucher)',
          'Confirmed Hotel Booking or Attestation d\'Accueil from host in France',
          'Schengen Travel Health Insurance with minimum €30,000 coverage including repatriation',
          'Official stamped bank statements for the past 3 to 6 months',
          'Proof of socio-professional status (Employment letter, tax clearance, CAC company docs)'
        ]
      },
      areThereHealthRequirements: {
        yellowFeverRequired: passportCode === 'NG' || passportCode === 'GH',
        yellowFeverDetails: 'Yellow card required if arriving from yellow fever endemic territory.',
        insuranceMandatory: true,
        insuranceMinCoverage: '€30,000 Schengen-compliant travel insurance',
        healthDeclarationRequired: false,
        additionalNotes: 'Insurance policy must be issued by a Schengen-approved insurer.'
      },
      areThereTransitRequirements: {
        airsideTransitVisaRequired: true,
        transitType: 'Airport Transit Visa (DATV) Route Dependent',
        commonRouteHubs: 'Air France (Direct Lagos/Abuja to Paris), or connections via Cairo (MS), Doha (QR), Istanbul (TK).',
        transitWarning: 'Connecting flights with a layover in another Schengen country (e.g. Frankfurt or Amsterdam before Paris) requires entering Schengen at the FIRST airport.'
      },
      howDoIApply: {
        stepByStepProcedure: '1. Create account on france-visas.gouv.fr and complete visa application.\n2. Book biometric appointment at TLScontact in Lagos (Victoria Island) or Abuja.\n3. Attend appointment for fingerprinting and document submission.\n4. Track passport processing (average 15-21 days).\n5. Collect passport with stamped Schengen visa.',
        applicationLink: 'https://france-visas.gouv.fr',
        recommendedSubmissionWindow: '1 to 3 months before scheduled travel'
      },
      whatDoesItCost: {
        visaFeeUSD: 98, // €90 standard visa fee (~$98 USD)
        preAuthFeeUSD: 0,
        arrivalFeeUSD: 0,
        totalUSD: 140, // Including TLS service fee (~$42)
        currencyNote: 'Adult visa fee is €90 EUR (~$98 USD) plus TLScontact biometric processing fee (~€38 EUR).'
      },
      howLongDoesItTake: {
        processingTimeDays: '15 to 30 calendar days',
        expeditedAvailable: false
      },
      whatAreTheConditions: {
        maxDuration: 'Up to duration granted on visa sticker.',
        prohibitedActivities: ['No paid work, freelancing, or employment in France.'],
        mandatoryConditions: ['Must travel with original supporting documents (insurance, hotel voucher) in hand baggage.']
      },
      whatIsTheOfficialSource: {
        sourceName: 'Consulate General of France in Nigeria / France-Visas',
        officialAuthority: 'French Ministry of Europe and Foreign Affairs',
        sourceType: 'OFFICIAL',
        datePublished: '2026-07-01'
      },
      whenWasItVerified: {
        lastVerifiedDate: '2026-09-14',
        isStale: false,
        isLiveAvailable: true,
        isDemoData: true
      }
    };
  }

  // 5. DOMESTIC NIGERIA 🇳🇬
  if (isDomestic) {
    return getDomesticCitizenPathway(destination, passportMeta.name);
  }

  // 6. DEFAULT / GLOBAL FALLBACK
  return getDefaultGlobalPathway(destination, rule, passportCode, passportMeta.name);
}

function getDomesticCitizenPathway(destination: Destination, citizenName: string): PracticalPathway14Questions {
  return {
    canIEnter: {
      verdict: 'CITIZEN_RIGHT',
      headline: 'Domestic Travel • Constitutional Freedom of Movement (No Visa or Passport Required)',
      practicalSummary: `You have an unalienable citizen right to travel to ${destination.name} without any visa, pre-travel authorization, or passport controls. A valid national ID or driver\'s license suffices for domestic flights and hotels.`,
    },
    doINeedAVisa: {
      statusText: 'No Visa Required (Domestic Citizen Movement)',
      isExempt: true,
      explanation: 'Travel within the national borders is free and exempt from immigration inspection.',
    },
    doINeedAnETA: {
      required: false,
      type: 'None',
      systemName: 'None (Domestic)',
      feeUSD: 0,
      leadTime: 'N/A',
      explanation: 'No pre-travel authorization exists or is required for domestic travel.',
    },
    doINeedOnlineRegistration: {
      required: false,
      systemName: 'Airline Check-In Only',
      deadline: 'Standard airline check-in (2h before flight)',
      explanation: 'Only standard airline check-in or vehicle boarding pass required.',
    },
    whatHappensWhenIArrive: {
      arrivalPermitType: 'Automatic Citizen Right',
      validityDuration: 'Unlimited / Indefinite',
      stepByStep: [
        'Disembark at domestic airport terminal or interstate transport terminus.',
        'Collect checked baggage from carousels.',
        'Exit terminal freely without passport control or immigration queues.'
      ],
      conditions: ['Compliance with local state municipal guidelines.']
    },
    whatDocumentsDoINeed: {
      passportValidityMonths: 0,
      blankPagesRequired: 0,
      returnTicketRequired: false,
      accommodationProofRequired: false,
      proofOfFundsText: 'Personal spending budget.',
      mandatoryChecklist: [
        'Valid National ID (NIN Card, Driver\'s License, Voter\'s Card, or Passport for domestic flight check-in)',
        'Domestic Flight Ticket or Boarding Pass',
        'Hotel or Resort Booking Voucher (if lodging)'
      ]
    },
    areThereHealthRequirements: {
      yellowFeverRequired: false,
      yellowFeverDetails: 'Not required for domestic travel within Nigeria.',
      insuranceMandatory: false,
      healthDeclarationRequired: false,
      additionalNotes: 'Standard personal travel medical insurance recommended.'
    },
    areThereTransitRequirements: {
      airsideTransitVisaRequired: false,
      transitType: 'None',
      commonRouteHubs: 'Direct domestic flights or interstate expressways from Lagos, Abuja, Port Harcourt, or Enugu.',
      transitWarning: 'No international borders crossed.'
    },
    howDoIApply: {
      stepByStepProcedure: 'No visa or permit application. Simply book domestic flight or road transport.',
      recommendedSubmissionWindow: 'N/A'
    },
    whatDoesItCost: {
      visaFeeUSD: 0,
      preAuthFeeUSD: 0,
      arrivalFeeUSD: 0,
      totalUSD: 0,
      currencyNote: 'Zero immigration or entry fees.'
    },
    howLongDoesItTake: {
      processingTimeDays: 'Immediate walk-through',
      expeditedAvailable: false
    },
    whatAreTheConditions: {
      maxDuration: 'Unlimited citizen residence and tourism duration.',
      prohibitedActivities: ['Standard national laws apply.'],
      mandatoryConditions: ['Carry valid identification.']
    },
    whatIsTheOfficialSource: {
      sourceName: 'Constitution of the Federal Republic of Nigeria (Section 41)',
      officialAuthority: 'Federal Government of Nigeria / Ministry of Interior',
      sourceType: 'OFFICIAL',
      datePublished: '2026-01-01'
    },
    whenWasItVerified: {
      lastVerifiedDate: '2026-09-20',
      isStale: false,
      isLiveAvailable: true,
      isDemoData: true
    }
  };
}

function getDefaultGlobalPathway(
  destination: Destination,
  rule: EntryRule,
  passportCode: PassportCode,
  nationalityName: string
): PracticalPathway14Questions {
  const isVisaFree = rule.status === 'Visa-Free' || rule.status === 'Visa Not Required';
  const isVoa = rule.status === 'Visa on Arrival';
  const isEvisa = rule.status === 'eVisa';

  let practicalSummary = '';
  if (isVisaFree) {
    practicalSummary = `You can enter ${destination.name} without a visa for short-term tourism up to ${rule.stayDuration}. You must present a valid passport, confirmed return ticket, and accommodation voucher at border gates.`;
  } else if (isVoa) {
    practicalSummary = `You can obtain a Visa on Arrival at the port of entry in ${destination.name}. Ensure you have your return ticket, hotel voucher, and payment ($${rule.feeEstimateUSD} USD in cash or card) ready upon landing.`;
  } else if (isEvisa) {
    practicalSummary = `You must obtain an approved eVisa online before boarding your flight to ${destination.name}. Apply through the official government immigration portal at least ${rule.processingTimeDays} in advance.`;
  } else {
    practicalSummary = `You require a pre-approved consular visa before travelling to ${destination.name}. Contact the nearest embassy or accredited visa center to submit biometric and documentary requirements.`;
  }

  return {
    canIEnter: {
      verdict: isVisaFree ? 'YES' : isVoa ? 'CONDITIONALLY' : 'VISA_REQUIRED',
      headline: `${rule.status} • Stay Permitted: ${rule.stayDuration}`,
      practicalSummary,
    },
    doINeedAVisa: {
      statusText: rule.status,
      isExempt: isVisaFree,
      explanation: isVisaFree 
        ? `${nationalityName} passport holders are exempt from tourist visas for up to ${rule.stayDuration}.`
        : `${nationalityName} passport holders must hold an authorized ${rule.status} for entry into ${destination.name}.`,
    },
    doINeedAnETA: {
      required: isEvisa,
      type: isEvisa ? 'eVisa / Electronic Authorisation' : 'None',
      systemName: isEvisa ? `Official ${destination.name} eVisa Portal` : 'Standard Visa Regime',
      feeUSD: rule.feeEstimateUSD,
      leadTime: rule.processingTimeDays,
      explanation: isEvisa ? 'Mandatory electronic travel visa required prior to airline check-in.' : 'No electronic pre-travel authorization specified.',
    },
    doINeedOnlineRegistration: {
      required: isEvisa,
      systemName: isEvisa ? `${destination.name} Online Immigration Service` : 'None',
      deadline: isEvisa ? rule.processingTimeDays : 'N/A',
      explanation: isEvisa ? 'Apply online and print approved eVisa approval letter.' : 'No mandatory online pre-registration indexed.',
    },
    whatHappensWhenIArrive: {
      arrivalPermitType: isVoa ? 'Visa on Arrival Desk' : 'Standard Border Immigration Stamp',
      validityDuration: rule.stayDuration,
      stepByStep: [
        `Disembark at international arrival terminal in ${destination.name}.`,
        isVoa ? `Proceed to the Visa on Arrival counter to pay $${rule.feeEstimateUSD} USD and receive entry sticker.` : 'Queue at standard foreign passport immigration counters.',
        'Present passport, return airline ticket, and hotel booking voucher.',
        'Border officer validates documents and stamps entry clearance.'
      ],
      conditions: [
        'Strictly for tourism / leisure purposes; no gainful employment allowed.',
        'Must depart on or before permitted stay expiration.'
      ]
    },
    whatDocumentsDoINeed: {
      passportValidityMonths: rule.passportValidityMonths || 6,
      blankPagesRequired: rule.blankPagesRequired || 2,
      returnTicketRequired: rule.returnTicketRequired,
      accommodationProofRequired: rule.accommodationProofRequired,
      proofOfFundsText: rule.proofOfFunds,
      mandatoryChecklist: rule.requiredDocuments || [
        `Passport valid for at least ${rule.passportValidityMonths || 6} months beyond arrival`,
        'Confirmed return or onward airline ticket',
        'Confirmed hotel reservation voucher or host invitation',
        'Proof of adequate financial means for duration of stay'
      ]
    },
    areThereHealthRequirements: {
      yellowFeverRequired: rule.healthRequirements?.yellowFeverRequired || false,
      yellowFeverDetails: rule.healthRequirements?.yellowFeverNotes || 'Yellow fever certificate required if arriving from yellow fever endemic areas.',
      insuranceMandatory: rule.healthRequirements?.insuranceMandatory || false,
      insuranceMinCoverage: rule.healthRequirements?.insuranceMinCoverage || 'Comprehensive travel insurance recommended',
      healthDeclarationRequired: false,
      additionalNotes: 'Check official port health directives prior to departure.'
    },
    areThereTransitRequirements: {
      airsideTransitVisaRequired: false,
      transitType: 'Route Dependent',
      commonRouteHubs: destination.routes?.routesFromAfrica?.[0]?.departureHub || 'Major international transit hubs',
      transitWarning: rule.transitNotes || 'Airside transit under 24 hours does not typically require a transit visa. Avoid self-transfers requiring terminal exits.'
    },
    howDoIApply: {
      stepByStepProcedure: rule.applicationProcedure,
      applicationLink: rule.applicationLink,
      recommendedSubmissionWindow: isEvisa ? '7 to 14 days before flight' : 'N/A'
    },
    whatDoesItCost: {
      visaFeeUSD: rule.feeEstimateUSD || 0,
      preAuthFeeUSD: 0,
      arrivalFeeUSD: 0,
      totalUSD: rule.feeEstimateUSD || 0,
      currencyNote: 'Approximate official government fee in USD.'
    },
    howLongDoesItTake: {
      processingTimeDays: rule.processingTimeDays || 'Standard border processing',
      expeditedAvailable: false
    },
    whatAreTheConditions: {
      maxDuration: rule.stayDuration,
      prohibitedActivities: ['Employment', 'Unauthorized business trade'],
      mandatoryConditions: ['Must present valid return ticket upon arrival.']
    },
    whatIsTheOfficialSource: {
      sourceName: rule.source || 'Official Consular & Immigration Authorities',
      officialAuthority: `${destination.name} Immigration Department`,
      sourceType: rule.trustLevel || 'OFFICIAL',
      datePublished: '2026-06-01'
    },
    whenWasItVerified: {
      lastVerifiedDate: rule.lastVerifiedDate || '2026-08-01',
      isStale: !!rule.isStale,
      isLiveAvailable: destination.hasLiveIntel !== false,
      isDemoData: true,
      reverificationNotice: rule.isStale ? 'Information may require re-verification.' : undefined
    }
  };
}
