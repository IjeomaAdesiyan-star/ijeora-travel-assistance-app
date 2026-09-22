import { PassportOption, PassportCode } from '../types';

export const PASSPORT_OPTIONS: PassportOption[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', demonym: 'Nigerian' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', demonym: 'Kenyan' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', demonym: 'Ghanaian' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', demonym: 'South African' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', demonym: 'Rwandan' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', demonym: 'British' },
  { code: 'US', name: 'United States', flag: '🇺🇸', demonym: 'American' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', demonym: 'Canadian' },
  { code: 'FR', name: 'France', flag: '🇫🇷', demonym: 'French' },
  { code: 'IN', name: 'India', flag: '🇮🇳', demonym: 'Indian' },
];

export const CURRENCY_RATES: Record<string, { symbol: string; rateFromUSD: number; name: string }> = {
  USD: { symbol: '$', rateFromUSD: 1, name: 'US Dollar' },
  NGN: { symbol: '₦', rateFromUSD: 1550, name: 'Nigerian Naira' },
  EUR: { symbol: '€', rateFromUSD: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rateFromUSD: 0.78, name: 'British Pound' },
  KES: { symbol: 'KSh', rateFromUSD: 129, name: 'Kenyan Shilling' },
  AED: { symbol: 'AED', rateFromUSD: 3.67, name: 'UAE Dirham' },
  CAD: { symbol: 'CA$', rateFromUSD: 1.38, name: 'Canadian Dollar' },
  ZAR: { symbol: 'R', rateFromUSD: 18.2, name: 'South African Rand' },
  GHS: { symbol: 'GH₵', rateFromUSD: 15.4, name: 'Ghanaian Cedi' },
  JPY: { symbol: '¥', rateFromUSD: 152, name: 'Japanese Yen' },
};

export function formatCurrency(amountUSD: number, currencyCode: string = 'USD'): string {
  const currency = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD;
  const converted = Math.round(amountUSD * currency.rateFromUSD);
  
  if (currencyCode === 'NGN' || currencyCode === 'JPY' || currencyCode === 'KES') {
    return `${currency.symbol}${converted.toLocaleString()}`;
  }
  return `${currency.symbol}${converted.toLocaleString()}`;
}
