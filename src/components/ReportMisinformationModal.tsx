import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { submitMisinformationReportToFirestore } from '../lib/firebase';

interface ReportMisinformationModalProps {
  topic: string;
  onClose: () => void;
}

export const ReportMisinformationModal: React.FC<ReportMisinformationModalProps> = ({ topic, onClose }) => {
  const [reportReason, setReportReason] = useState('incorrect_visa_rule');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await submitMisinformationReportToFirestore({
        topic,
        reason: reportReason,
        description,
        evidenceUrl: evidenceUrl || undefined
      });
    } catch (err) {
      console.warn('[Firebase] Report save error:', err);
    }
    setSaving(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Report Inaccurate Travel Intelligence</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Report Sent to IJEORA Moderation</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Thank you for keeping fellow travellers safe. Our verification team will cross-check the official sources within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400 block">Regarding topic:</span>
              <strong className="text-amber-300 font-semibold">{topic}</strong>
            </div>

            <div>
              <label htmlFor="report-category" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Issue Category
              </label>
              <select
                id="report-category"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="incorrect_visa_rule">Incorrect Visa / Entry Requirements</option>
                <option value="outdated_fee">Outdated Official Fee or Cost</option>
                <option value="border_policy_change">New Border Policy Announced</option>
                <option value="health_rule_changed">Yellow Fever or Vaccine Change</option>
                <option value="scam_warning">Suspected Portal Scam / Predatory Link</option>
              </select>
            </div>

            <div>
              <label htmlFor="report-notes" className="block text-xs font-semibold text-slate-300 mb-1.5">
                What is the actual reality? (Details)
              </label>
              <textarea
                id="report-notes"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened at the border or what official requirement recently changed..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="report-evidence" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Gazette / Source Link (Optional)
              </label>
              <input
                id="report-evidence"
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://immigration.gov..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
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
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{saving ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
