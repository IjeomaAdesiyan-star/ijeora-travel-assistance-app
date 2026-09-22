import React, { useState } from 'react';
import { Destination, PassportCode } from '../types';
import { PASSPORT_OPTIONS } from '../data/passports';
import { X, Send, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { submitCommunityReportToFirestore } from '../lib/firebase';

interface SubmitReportModalProps {
  destinations: Destination[];
  userPassport: PassportCode;
  onClose: () => void;
  onSubmitSuccess: (report: any) => void;
}

export const SubmitReportModal: React.FC<SubmitReportModalProps> = ({
  destinations,
  userPassport,
  onClose,
  onSubmitSuccess,
}) => {
  const [destId, setDestId] = useState(destinations[0]?.id || 'zanzibar');
  const [passport, setPassport] = useState<PassportCode>(userPassport);
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [entryPort, setEntryPort] = useState('');
  const [comment, setComment] = useState('');
  const [hasTicketProof, setHasTicketProof] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const newReport = {
      id: `rep-${Date.now()}`,
      destinationId: destId,
      author: authorName.trim() || 'Verified Traveller',
      authorPassport: passport,
      nationalityFlag: PASSPORT_OPTIONS.find((p) => p.code === passport)?.flag || '🌍',
      entryPort: entryPort.trim() || 'International Airport',
      date: 'Just now',
      title: title.trim(),
      comment: comment.trim(),
      helpfulVotes: 1,
      verifiedTrip: hasTicketProof,
    };

    try {
      await submitCommunityReportToFirestore(newReport);
    } catch (err) {
      console.warn('[Firebase] Trip report save notice:', err);
    }

    setSaving(false);
    onSubmitSuccess(newReport);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Log Your Border & Trip Reality</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Report Added to IJEORA Intelligence</h4>
            <p className="text-xs text-slate-300">
              Your feedback is now live to help fellow travellers prepare before departing!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination</label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.flag} {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Passport</label>
                <select
                  value={passport}
                  onChange={(e) => setPassport(e.target.value as PassportCode)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {PASSPORT_OPTIONS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.flag} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name / Handle</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Amaka B."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Port of Entry</label>
                <input
                  type="text"
                  required
                  value={entryPort}
                  onChange={(e) => setEntryPort(e.target.value)}
                  placeholder="e.g. Abeid Amani Karume Int'l (ZNZ)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smooth immigration check, but mandatory insurance checked strictly"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Border & Stay Reality</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What documents were checked? How long was queue? Any cash or card surprises? Local transport advice..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">I completed this travel in the last 6 months</span>
              <input
                type="checkbox"
                checked={hasTicketProof}
                onChange={(e) => setHasTicketProof(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Experience</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
