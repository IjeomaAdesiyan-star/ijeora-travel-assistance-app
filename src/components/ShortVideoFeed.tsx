import React, { useState, useEffect, useMemo } from 'react';
import { ShortVideo, Destination } from '../types';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ChevronUp,
  ChevronDown,
  UserCheck,
  UserPlus,
  Send,
  X,
  AlertCircle,
  Lightbulb,
  Search,
  Film,
  MapPin,
} from 'lucide-react';

interface ShortVideoFeedProps {
  videos: ShortVideo[];
  destinations: Destination[];
  onOpenDestination: (dest: Destination) => void;
  onSaveVideo?: (videoId: string) => void;
  onReportMisinformation?: (videoTitle: string) => void;
  savedVideoIds: string[];
  initialVideoId?: string | null;
}

export const ShortVideoFeed: React.FC<ShortVideoFeedProps> = ({
  videos,
  destinations,
  onOpenDestination,
  onSaveVideo,
  onReportMisinformation,
  savedVideoIds,
  initialVideoId,
}) => {
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>('all');
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    videos.forEach((v) => {
      initial[v.id] = v.likes;
    });
    return initial;
  });
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [activeCommentsVideoId, setActiveCommentsVideoId] = useState<string | null>(null);
  const [commentsList, setCommentsList] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'vid-1': [
      { author: 'Chinedu O.', text: 'Kendwa sunset dhow is worth every single dollar! Don’t skip the fruit platter.', time: '2h ago' },
      { author: 'Fatima Z.', text: 'Does Forodhani accept card payments yet?', time: '5h ago' },
      { author: 'Simi On The Go', text: '@Fatima Z. No, only Tanzanian Shillings or USD cash for street vendors!', time: '4h ago' },
    ],
    'vid-2': [
      { author: 'Ayo Davies', text: 'Travelled with Air Peace connecting to Kenya Airways, seamless entry with green passport!', time: '1d ago' },
      { author: 'Lillian K.', text: 'Do they ask for travel insurance at SSR airport?', time: '2d ago' },
    ],
    'vid-7': [
      { author: 'Ngozi B.', text: 'Can confirm! Ethiopian Airlines staff at Lagos airport asked to see SEBS barcode on my phone before printing my boarding pass.', time: '1d ago' },
      { author: 'Emeka T.', text: 'Is the €10.90 paid online with a Nigerian domiciliary card?', time: '3d ago' },
    ],
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [shareToast, setShareToast] = useState(false);

  // Sync initial video ID when passed
  useEffect(() => {
    if (initialVideoId) {
      const idx = videos.findIndex((v) => v.id === initialVideoId || v.destinationId === initialVideoId);
      if (idx !== -1) {
        setCurrentIndex(idx);
        setSelectedDestinationFilter('all');
      }
    }
  }, [initialVideoId, videos]);

  // Filtered video list based on destination filter or search
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesFilter =
        selectedDestinationFilter === 'all' ||
        v.destinationId === selectedDestinationFilter ||
        (selectedDestinationFilter === 'domestic' && v.destinationCountry === 'Nigeria');

      const matchesSearch =
        videoSearchQuery.trim() === '' ||
        v.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
        v.caption.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
        v.destinationName.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
        v.destinationCountry.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
        v.creator.name.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(videoSearchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [videos, selectedDestinationFilter, videoSearchQuery]);

  // Keep currentIndex bounded
  useEffect(() => {
    if (currentIndex >= filteredVideos.length && filteredVideos.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredVideos.length, currentIndex]);

  const activeVideo = filteredVideos[currentIndex] || videos[0];

  // Resolve associated destination safely
  const associatedDest = useMemo(() => {
    if (!activeVideo) return destinations[0];
    const directMatch = destinations.find((d) => d.id === activeVideo.destinationId);
    if (directMatch) return directMatch;
    const countryMatch = destinations.find(
      (d) =>
        d.name.toLowerCase().includes(activeVideo.destinationName.toLowerCase()) ||
        d.country.toLowerCase() === activeVideo.destinationCountry.toLowerCase()
    );
    return countryMatch || destinations[0];
  }, [activeVideo, destinations]);

  const handleNext = () => {
    if (currentIndex < filteredVideos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, filteredVideos.length - 1));
    }
  };

  const toggleLike = (id: string) => {
    setLikedVideos((prev) => {
      const isLiked = !prev[id];
      setLikesCount((lc) => ({
        ...lc,
        [id]: (lc[id] || 0) + (isLiked ? 1 : -1),
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const toggleFollow = (creatorHandle: string) => {
    setFollowedCreators((prev) => ({
      ...prev,
      [creatorHandle]: !prev[creatorHandle],
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsVideoId) return;

    setCommentsList((prev) => ({
      ...prev,
      [activeCommentsVideoId]: [
        { author: 'You (Traveller)', text: newCommentText.trim(), time: 'Just now' },
        ...(prev[activeCommentsVideoId] || []),
      ],
    }));
    setNewCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  // Distinct destinations for filter pills
  const destinationFilterOptions = [
    { id: 'all', label: 'All Destinations', count: videos.length },
    { id: 'domestic', label: '🇳🇬 Nigeria Domestic', count: videos.filter((v) => v.destinationCountry === 'Nigeria').length },
    { id: 'seychelles', label: '🇸🇨 Seychelles', count: videos.filter((v) => v.destinationId === 'seychelles').length },
    { id: 'zanzibar', label: '🇹🇿 Zanzibar', count: videos.filter((v) => v.destinationId === 'zanzibar').length },
    { id: 'mauritius', label: '🇲🇺 Mauritius', count: videos.filter((v) => v.destinationId === 'mauritius').length },
    { id: 'kenya', label: '🇰🇪 Kenya', count: videos.filter((v) => v.destinationId === 'kenya').length },
    { id: 'rwanda', label: '🇷🇼 Rwanda', count: videos.filter((v) => v.destinationId === 'rwanda').length },
    { id: 'uae', label: '🇦🇪 Dubai', count: videos.filter((v) => v.destinationId === 'uae').length },
    { id: 'south-africa', label: '🇿🇦 South Africa', count: videos.filter((v) => v.destinationId === 'south-africa').length },
    { id: 'france', label: '🇫🇷 Paris', count: videos.filter((v) => v.destinationId === 'france').length },
    { id: 'japan', label: '🇯🇵 Japan', count: videos.filter((v) => v.destinationId === 'japan').length },
    { id: 'united-kingdom', label: '🇬🇧 UK', count: videos.filter((v) => v.destinationId === 'united-kingdom').length },
    { id: 'ghana', label: '🇬🇭 Ghana', count: videos.filter((v) => v.destinationId === 'ghana').length },
    { id: 'egypt', label: '🇪🇬 Egypt', count: videos.filter((v) => v.destinationId === 'egypt').length },
  ].filter((opt) => opt.count > 0 || opt.id === 'all');

  return (
    <div id="short-video-feed-container" className="relative max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Exact Destination Match • {videos.length} Verified Field Shorts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Destination Visuals & On-the-Ground Reality
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Every short is paired directly with statutory visa rules, airport reality checks, and local budget intelligence.
          </p>
        </div>

        {/* Video Search & Counter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={videoSearchQuery}
              onChange={(e) => setVideoSearchQuery(e.target.value)}
              placeholder="Search destination, city, or tip..."
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-44 sm:w-60"
            />
            {videoSearchQuery && (
              <button
                onClick={() => setVideoSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300">
            <span className="font-bold text-amber-400">{filteredVideos.length > 0 ? currentIndex + 1 : 0}</span>
            <span className="text-slate-500">/</span>
            <span>{filteredVideos.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={filteredVideos.length <= 1}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 transition-colors"
              title="Previous video"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={filteredVideos.length <= 1}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 transition-colors"
              title="Next video"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Destination Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {destinationFilterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              setSelectedDestinationFilter(opt.id);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedDestinationFilter === opt.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedDestinationFilter === opt.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      {filteredVideos.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800 my-6">
          <Film className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-300 font-semibold text-sm">No videos match your search</p>
          <p className="text-slate-500 text-xs mt-1">Try clearing your search query or selecting "All Destinations"</p>
          <button
            onClick={() => {
              setVideoSearchQuery('');
              setSelectedDestinationFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Show All Videos
          </button>
        </div>
      ) : (
        <>
          {/* Main Video Viewport (Vertical aspect 9:16 optimized for mobile & desktop) */}
          <div className="relative w-full max-w-md mx-auto aspect-[9/16] sm:max-h-[640px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            {/* Background Visual Layer */}
            <img
              src={activeVideo.posterUrl}
              alt={`${activeVideo.destinationName} - ${activeVideo.title}`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-105"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 pointer-events-none" />

            {/* Top Floating Bar: Destination Badge + Category Pill + Sound Button */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1">
                  <span>{activeVideo.destinationFlag}</span>
                  <span>{activeVideo.destinationName}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-[11px] font-medium text-slate-200">
                  {activeVideo.category}
                </span>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:bg-slate-900 transition-colors flex-shrink-0"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>
            </div>

            {/* Right Side Engagement Action Column */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-20">
              {/* Like */}
              <button
                onClick={() => toggleLike(activeVideo.id)}
                className="flex flex-col items-center group"
              >
                <div
                  className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                    likedVideos[activeVideo.id]
                      ? 'bg-rose-500 text-white border-rose-400 scale-110 shadow-lg shadow-rose-500/30'
                      : 'bg-slate-950/60 text-white border-white/20 hover:bg-slate-900/80'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${likedVideos[activeVideo.id] ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] font-bold text-white mt-1 drop-shadow">
                  {(likesCount[activeVideo.id] || 0).toLocaleString()}
                </span>
              </button>

              {/* Comment */}
              <button
                onClick={() => setActiveCommentsVideoId(activeVideo.id)}
                className="flex flex-col items-center group"
              >
                <div className="p-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white hover:bg-slate-900/80 transition-all">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1 drop-shadow">
                  {commentsList[activeVideo.id]?.length || activeVideo.commentsCount}
                </span>
              </button>

              {/* Save / Bookmark */}
              <button
                onClick={() => onSaveVideo && onSaveVideo(activeVideo.id)}
                className="flex flex-col items-center group"
              >
                <div
                  className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                    savedVideoIds.includes(activeVideo.id)
                      ? 'bg-amber-500 text-slate-950 border-amber-400 scale-110'
                      : 'bg-slate-950/60 text-white border-white/20 hover:bg-slate-900/80'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${savedVideoIds.includes(activeVideo.id) ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] font-bold text-white mt-1 drop-shadow">Save</span>
              </button>

              {/* Share */}
              <button onClick={handleShare} className="flex flex-col items-center group">
                <div className="p-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white hover:bg-slate-900/80 transition-all">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1 drop-shadow">Share</span>
              </button>
            </div>

            {/* Bottom Content Area: Creator + Title + Intelligence Pill + Open Destination Action */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pr-16 sm:pr-20 z-10 flex flex-col gap-2.5">
              {/* Creator Profile */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={activeVideo.creator.avatar}
                    alt={activeVideo.creator.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-amber-400/80 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">{activeVideo.creator.name}</span>
                      {activeVideo.creator.verified && (
                        <span className="w-3 h-3 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[8px] font-black flex-shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-300 truncate block">{activeVideo.creator.handle}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(activeVideo.creator.handle)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0 whitespace-nowrap ${
                    followedCreators[activeVideo.creator.handle]
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-white text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  {followedCreators[activeVideo.creator.handle] ? (
                    <>
                      <UserCheck className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Caption */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white drop-shadow leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 drop-shadow leading-relaxed">
                  {activeVideo.caption}
                </p>
              </div>

              {/* Practical Intelligence Banner (Unique to IJEORA!) */}
              <div className="p-2.5 rounded-xl bg-amber-950/85 border border-amber-500/50 backdrop-blur-md flex items-start gap-2 text-xs text-amber-200 shadow-lg">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-bold text-white">Know Before You Go: </span>
                  <span>{activeVideo.intelligenceTip}</span>
                </div>
              </div>

              {/* Destination Navigation Launcher */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  id={`btn-open-dest-intel-${activeVideo.destinationId}`}
                  onClick={() => onOpenDestination(associatedDest)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Explore {activeVideo.destinationName} Guide</span>
                </button>

                {onReportMisinformation && (
                  <button
                    onClick={() => onReportMisinformation(activeVideo.title)}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700/80 transition-colors flex-shrink-0"
                    title="Report inaccurate advice"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Share Toast */}
            {shareToast && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-slate-900/95 border border-amber-500/50 text-amber-200 text-xs font-bold shadow-2xl animate-fade-in z-30">
                Link copied to clipboard!
              </div>
            )}
          </div>

          {/* Quick Destination Video Thumbnails Selector */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Jump to Destination Short:</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Tap thumbnail to watch
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {filteredVideos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`group relative aspect-[9/14] rounded-xl overflow-hidden border-2 transition-all text-left ${
                    idx === currentIndex
                      ? 'border-amber-400 shadow-md shadow-amber-500/30 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={vid.posterUrl}
                    alt={vid.destinationName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-1 left-1 text-[11px]">
                    {vid.destinationFlag}
                  </div>
                  <div className="absolute bottom-1 inset-x-1">
                    <span className="text-[9px] font-bold text-white block truncate leading-tight">
                      {vid.destinationName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Interactive Comments Drawer / Overlay */}
      {activeCommentsVideoId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>Traveller Discussion</span>
              </h4>
              <button
                onClick={() => setActiveCommentsVideoId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {(commentsList[activeCommentsVideoId] || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No comments yet. Be the first to share your on-the-ground reality!
                </p>
              ) : (
                (commentsList[activeCommentsVideoId] || []).map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <strong className="text-amber-300 font-semibold">{c.author}</strong>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-slate-200">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share a travel tip or ask a question..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
