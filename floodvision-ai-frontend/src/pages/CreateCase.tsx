import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, FileText, Type, Navigation, Compass, Check } from "lucide-react";

export default function CreateCase() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    locationName: "",
    latitude: "",
    longitude: "",
    eventDate: "",
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // POST /api/v1/cases — mock submission for Phase 1
    setSubmitted(true);
    setTimeout(() => navigate("/cases"), 1400);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-100">Create Flood Case</h1>
        <p className="text-sm text-slate-400">
          Register a new flood event to begin imagery upload and assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-ink-700 bg-ink-800 p-6 shadow-panel">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <Type size={13} /> Case Title
          </label>
          <input
            required
            value={form.title}
            onChange={update("title")}
            placeholder="e.g. Kolar Riverbank Overflow"
            className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-flood-500 focus:outline-none focus:ring-1 focus:ring-flood-500/40"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <FileText size={13} /> Description
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={update("description")}
            placeholder="Brief summary of the flooding event, cause and affected area..."
            className="w-full resize-none rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-flood-500 focus:outline-none focus:ring-1 focus:ring-flood-500/40"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <MapPin size={13} /> Location Name
          </label>
          <input
            required
            value={form.locationName}
            onChange={update("locationName")}
            placeholder="e.g. Kolar District, Karnataka"
            className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-flood-500 focus:outline-none focus:ring-1 focus:ring-flood-500/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              <Navigation size={13} /> Latitude
            </label>
            <input
              required
              value={form.latitude}
              onChange={update("latitude")}
              placeholder="13.1362"
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-flood-500 focus:outline-none focus:ring-1 focus:ring-flood-500/40"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              <Compass size={13} /> Longitude
            </label>
            <input
              required
              value={form.longitude}
              onChange={update("longitude")}
              placeholder="78.1298"
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-flood-500 focus:outline-none focus:ring-1 focus:ring-flood-500/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <Calendar size={13} /> Event Date
          </label>
          <input
            required
            type="date"
            value={form.eventDate}
            onChange={update("eventDate")}
            className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-100 focus:border-flood-500 focus:outline-none focus:ring-1 focus:ring-flood-500/40"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-700 pt-5">
          <button
            type="button"
            onClick={() => navigate("/cases")}
            className="rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-ink-700/50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitted}
            className="flex items-center gap-2 rounded-lg bg-flood-500 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-glow hover:bg-flood-400 disabled:opacity-70"
          >
            {submitted ? (
              <>
                <Check size={16} /> Case Created
              </>
            ) : (
              "Submit Flood Case"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
