import React, { useState } from 'react';
import { Destination, PassportCode } from '../types';
import { formatCurrency } from '../data/passports';
import { Bookmark, Compass, Sparkles, Filter } from 'lucide-react';

interface MasonryExploreProps {
  destinations: Destination[];
  userPassport: PassportCode;
  onSelectDestination: (dest: Destination) => void;
  onSaveDestination: (destId: string) => void;
  savedDestinationIds: string[];
  currency: string;
}

const CATEGORIES = [
  'All',
  '🇳🇬 Nigeria Domestic',
  'Waterfalls & Springs',
  'Weekend Escapes',
  'Inspiration',
  'Beaches',
  'Safari',
  'Food',
  'Culture',
  'Hotels',
  'Things To Do',
  'Luxury',
  'Hidden Gems',
];

export const MasonryExplore: React.FC<MasonryExploreProps> = ({
  destinations,
  userPassport,
  onSelectDestination,
  onSaveDestination,
  savedDestinationIds,
  currency,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Expand destinations into multi-facet visual cards (places, food, stays, attractions)
  const items = React.useMemo(() => {
    const list: {
      id: string;
      destId: string;
      title: string;
      subtitle: string;
      category: string;
      image: string;
      badgeText: string;
      statusColor?: string;
      estimatedUSD: number;
      aspectRatioClass: string;
      destination: Destination;
    }[] = [];

    destinations.forEach((dest) => {
      const entryRule = dest.entryRulesByPassport[userPassport];
      const visaStatus = entryRule ? entryRule.status : 'Check Rules';

      // 1. Destination Main Place Card
      list.push({
        id: `dest-${dest.id}`,
        destId: dest.id,
        title: `${dest.name}, ${dest.country}`,
        subtitle: dest.tagline,
        category: 'Places',
        image: dest.heroImage,
        badgeText: `${visaStatus} for ${userPassport}`,
        statusColor: visaStatus.includes('Free') ? 'emerald' : visaStatus.includes('Required') ? 'rose' : 'amber',
        estimatedUSD: dest.dailyBudgetEstimateUSD.moderate,
        aspectRatioClass: 'aspect-[3/4]',
        destination: dest,
      });

      // 2. Attractions Card
      if (dest.attractions[0]) {
        list.push({
          id: `att-${dest.attractions[0].id}`,
          destId: dest.id,
          title: dest.attractions[0].name,
          subtitle: `Attraction in ${dest.name} • ${dest.attractions[0].category}`,
          category: dest.attractions[0].category === 'Safari' ? 'Safari' : dest.attractions[0].category === 'Beaches' ? 'Beaches' : 'Things To Do',
          image: dest.attractions[0].image,
          badgeText: `${dest.attractions[0].category}`,
          statusColor: 'sky',
          estimatedUSD: dest.attractions[0].typicalCostUSD,
          aspectRatioClass: 'aspect-[4/5]',
          destination: dest,
        });
      }

      // 3. Hotel Card
      if (dest.hotels[0]) {
        list.push({
          id: `hotel-${dest.hotels[0].id}`,
          destId: dest.id,
          title: dest.hotels[0].name,
          subtitle: `${dest.hotels[0].category} Stay • ${dest.hotels[0].rating} ★`,
          category: 'Hotels',
          image: dest.hotels[0].image,
          badgeText: `${dest.hotels[0].category} Hotel`,
          statusColor: 'purple',
          estimatedUSD: dest.hotels[0].pricePerNightUSD,
          aspectRatioClass: 'aspect-[4/5] min-h-[320px]',
          destination: dest,
        });
      }

      // 4. Food & Culture Card
      if (dest.foodAndCulture[0]) {
        list.push({
          id: `food-${dest.id}`,
          destId: dest.id,
          title: dest.foodAndCulture[0].name,
          subtitle: `${dest.foodAndCulture[0].description.slice(0, 75)}...`,
          category: 'Food',
          image: dest.gallery[0] || dest.heroImage,
          badgeText: 'Local Cuisine',
          statusColor: 'amber',
          estimatedUSD: dest.foodAndCulture[0].avgCostUSD || 10,
          aspectRatioClass: 'aspect-[3/4]',
          destination: dest,
        });
      }
    });

    return list;
  }, [destinations, userPassport]);

  const filteredItems = items.filter((item) => {
    const isDomestic = item.destination.isDomestic;
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === '🇳🇬 Nigeria Domestic' && isDomestic) ||
      (selectedCategory === 'Waterfalls & Springs' && (item.destination.domesticCategory?.includes('waterfall') || item.title.toLowerCase().includes('fall') || item.title.toLowerCase().includes('spring'))) ||
      (selectedCategory === 'Weekend Escapes' && (item.destination.getawayFrom && item.destination.getawayFrom.length > 0)) ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Inspiration' && true) ||
      (selectedCategory === 'Luxury' && item.estimatedUSD > 250);

    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.destination.stateOrProvince && item.destination.stateOrProvince.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="masonry-explore-container" className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Discovery Grid</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Curated Global Inspiration
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore destinations, hidden gems, street food, and luxury stays. Save your favorites directly to your custom travel collections.
          </p>
        </div>

        {/* Search input in explore */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter places, foods, safari..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <div className="flex items-center gap-1 text-xs text-slate-400 pr-2 border-r border-slate-800">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Category:</span>
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`btn-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinterest-Style Responsive Masonry Columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filteredItems.map((item) => {
          const isSaved = savedDestinationIds.includes(item.destId);

          return (
            <div
              key={item.id}
              onClick={() => onSelectDestination(item.destination)}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer flex flex-col"
            >
              {/* Image Container with Dynamic Aspect Ratio */}
              <div className={`relative w-full ${item.aspectRatioClass} overflow-hidden bg-slate-950`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Horizon Light Beam effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Floating Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md border max-w-[75%] truncate whitespace-nowrap ${
                      item.statusColor === 'emerald'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : item.statusColor === 'rose'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {item.badgeText}
                  </span>

                  {/* Bookmark / Save Button (Stop propagation to prevent card opening) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveDestination(item.destId);
                    }}
                    className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all flex-shrink-0 ${
                      isSaved
                        ? 'bg-amber-500 text-slate-950 border-amber-400 scale-110 shadow-md'
                        : 'bg-slate-950/60 text-white border-white/20 hover:bg-slate-900'
                    }`}
                    title={isSaved ? 'Saved in collection' : 'Save to collection'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-4 pt-12 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 leading-none">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-amber-100 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 font-normal leading-relaxed">
                    {item.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10 text-xs">
                    <span className="text-slate-400">
                      Est. <strong className="text-white">{formatCurrency(item.estimatedUSD, currency)}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <Compass className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
