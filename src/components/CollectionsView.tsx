import React, { useState } from 'react';
import { Collection, Destination } from '../types';
import { Bookmark, Plus, Folder, Lock, Globe2, Compass, Share2, Trash2 } from 'lucide-react';

interface CollectionsViewProps {
  collections: Collection[];
  destinations: Destination[];
  savedDestinationIds: string[];
  onSelectDestination: (dest: Destination) => void;
  onCreateCollection: (name: string, description: string, isPrivate: boolean) => void;
  currency: string;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  destinations,
  savedDestinationIds,
  onSelectDestination,
  onCreateCollection,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColPrivate, setNewColPrivate] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onCreateCollection(newColName.trim(), newColDesc.trim(), newColPrivate);
    setNewColName('');
    setNewColDesc('');
    setShowCreateModal(false);
  };

  const savedDestinationsList = destinations.filter((d) => savedDestinationIds.includes(d.id));

  return (
    <div id="collections-view-container" className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Curated Boards</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Saved Collections & Trip Boards
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Organize verified destinations, visa-free ideas, luxury stays, and inspiration boards.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Quick Saved Destinations Shelf */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400 fill-current" />
            <span>Directly Bookmarked Destinations ({savedDestinationsList.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Available offline & across sessions</span>
        </div>

        {savedDestinationsList.length === 0 ? (
          <div className="py-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80">
            <p className="text-xs sm:text-sm text-slate-400">
              No destinations bookmarked yet. Tap the bookmark icon on any destination card or guide to save it here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedDestinationsList.map((dest) => (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all shadow-md"
              >
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5">
                    <span>{dest.flag}</span>
                    <strong className="text-sm text-white">{dest.name}</strong>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{dest.country}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Curated Pinterest-style Collections Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Thematic Boards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {collections.map((col) => {
            const memberDests = destinations.filter((d) => col.destinationIds.includes(d.id));

            return (
              <div
                key={col.id}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl flex flex-col transition-all"
              >
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-slate-300 border border-white/10 flex items-center gap-1">
                    {col.isPrivate ? <Lock className="w-3 h-3 text-amber-400" /> : <Globe2 className="w-3 h-3 text-sky-400" />}
                    <span>{col.isPrivate ? 'Private' : 'Public'}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {col.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{col.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>{memberDests.length} Destinations</span>
                    <div className="flex -space-x-1.5">
                      {memberDests.slice(0, 3).map((d) => (
                        <span
                          key={d.id}
                          className="inline-block w-5 h-5 rounded-full bg-slate-800 text-[10px] border border-slate-700 text-center leading-5 shadow-sm"
                          title={d.name}
                        >
                          {d.flag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create New Collection</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Collection Name</label>
                <input
                  type="text"
                  required
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g. 2026 Solo Escapes, Winter Island Retreats"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder="What is the mood or goal of this trip board?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Make Collection Private</span>
                  <span className="text-[11px] text-slate-400">Only you can view these saved items</span>
                </div>
                <input
                  type="checkbox"
                  checked={newColPrivate}
                  onChange={(e) => setNewColPrivate(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
