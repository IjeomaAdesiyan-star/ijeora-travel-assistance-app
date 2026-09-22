import { Collection } from '../types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-visa-free-ng',
    name: 'Visa-Free Escapes (Nigerian Passport)',
    description: 'Breathtaking global destinations you can fly to with zero visa stress, simply with your passport and return ticket.',
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    isPrivate: false,
    destinationIds: ['mauritius', 'rwanda'],
    createdAt: '2026-08-01',
  },
  {
    id: 'col-honeymoon',
    name: 'Dream Honeymoon Islands & Lagoons',
    description: 'Private overwater bungalows, turquoise coral sandbanks, and candlelit seafood dinners.',
    coverImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    isPrivate: false,
    destinationIds: ['zanzibar', 'mauritius'],
    createdAt: '2026-08-10',
  },
  {
    id: 'col-safari',
    name: 'Wild Horizons: African Safaris',
    description: 'The Great Migration, elephant herds under Kilimanjaro, and luxury tented camps.',
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    isPrivate: false,
    destinationIds: ['kenya', 'rwanda'],
    createdAt: '2026-08-15',
  },
  {
    id: 'col-food',
    name: 'Global Gastronomy & Street Markets',
    description: 'From sizzling Tokyo ramen alleys to Stone Town night markets and Parisian boulangeries.',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    isPrivate: true,
    destinationIds: ['japan', 'france', 'zanzibar'],
    createdAt: '2026-08-20',
  }
];
