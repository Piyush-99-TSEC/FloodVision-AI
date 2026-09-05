import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, FileText, Type, Navigation, Compass, Check, Loader2 } from "lucide-react";
import { casesApi } from "../api/client";

export default function CreateCase() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    locationName: "",
    latitude: "",
    longitude: "",
    eventDate: new Date().toISOString().split("T")[0],
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const lat = parseFloat(form.latitude);
      const lng = parseFloat(form.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Please enter valid numeric latitude and longitude values.");
      }

      const res = await casesApi.createCase({
        title: form.title,
        description: form.description,
        location: {
          name: form.locationName,
          latitude: lat,
          longitude: lng,
        },
        eventDate: form.eventDate,
      });

      if (res.success) {
        setSubmitted(true);
        setTimeout(() => navigate("/cases"), 1200);
      } else {
        throw new Error(res.message || "Failed to create case");
      }
    } catch (err: any) {
      console.error("Create case error:", err);
      setError(err.message || "Failed to submit flood case to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Register New Flood Case</h1>
        <p className="text-sm font-medium text-slate-500">
          Enter disaster incident metadata and location coordinates to initialize assessment tracking in MongoDB Atlas.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Type size={14} className="text-slate-400" /> Case Title
          </label>
          <input
            required
            value={form.title}
            onChange={update("title")}
            placeholder="e.g. Kolar Riverbank Overflow"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <FileText size={14} className="text-slate-400" /> Incident Description
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={update("description")}
            placeholder="Brief summary of the flooding event, cause, river breach details and impacted area..."
            className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <MapPin size={14} className="text-slate-400" /> Location Name
          </label>
          <input
            required
            value={form.locationName}
            onChange={update("locationName")}
            placeholder="e.g. Kolar District, Karnataka"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Navigation size={14} className="text-slate-400" /> Latitude
            </label>
            <input
              required
              value={form.latitude}
              onChange={update("latitude")}
              placeholder="13.1362"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Compass size={14} className="text-slate-400" /> Longitude
            </label>
            <input
              required
              value={form.longitude}
              onChange={update("longitude")}
              placeholder="78.1298"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Calendar size={14} className="text-slate-400" /> Event Date
          </label>
          <input
            required
            type="date"
            value={form.eventDate}
            onChange={update("eventDate")}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/cases")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || submitted}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting...
              </>
            ) : submitted ? (
              <>
                <Check size={16} /> Case Registered
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

