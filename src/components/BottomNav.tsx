import React from 'react';
import { Home, ShieldCheck, Compass, Video, Bookmark, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'explore' | 'cango' | 'videos' | 'saved' | 'profile';
  setCurrentTab: (tab: 'home' | 'explore' | 'cango' | 'videos' | 'saved' | 'profile') => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, savedCount }) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2 px-3">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] whitespace-nowrap">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('cango')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'cango' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] whitespace-nowrap">Can I Go?</span>
        </button>

        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'explore' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] whitespace-nowrap">Explore</span>
        </button>

        <button
          onClick={() => setCurrentTab('videos')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'videos' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Video className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span className="text-[10px] whitespace-nowrap">Shorts</span>
        </button>

        <button
          onClick={() => setCurrentTab('saved')}
          className={`relative flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'saved' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] whitespace-nowrap">Saved</span>
          {savedCount > 0 && (
            <span className="absolute -top-1 right-2 sm:right-4 w-3.5 h-3.5 rounded-full bg-amber-500 text-[9px] font-extrabold text-slate-950 flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] whitespace-nowrap">Profile</span>
        </button>
      </div>
    </nav>
  );
};
