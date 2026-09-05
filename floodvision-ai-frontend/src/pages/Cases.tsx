import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Calendar, Building2, Plus, ArrowRight, Loader2 } from "lucide-react";
import { CaseStatus, FloodCase } from "../types";
import { CaseStatusBadge } from "../components/StatusBadge";
import { casesApi } from "../api/client";

const filters: { label: string; value: CaseStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Under Assessment", value: "assessing" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Closed", value: "closed" },
];

export default function Cases() {
  const [cases, setCases] = useState<FloodCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CaseStatus | "all">("all");

  useEffect(() => {
    async function fetchCases() {
      try {
        setLoading(true);
        const res = await casesApi.getCases();
        if (res.success && res.data) {
          setCases(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = status === "all" || c.status === status;
      const locationName = c.location?.name || "";
      const matchesQuery =
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        locationName.toLowerCase().includes(query.toLowerCase()) ||
        c.caseId.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [cases, query, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Flood Incident Cases</h1>
          <p className="text-sm font-medium text-slate-500">
            Showing {filtered.length} of {cases.length} registered flood disaster cases from MongoDB Atlas
          </p>
        </div>
        <Link
          to="/cases/new"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> New Case
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 sm:w-80 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, location or ID..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <SlidersHorizontal size={15} className="shrink-0 text-slate-500" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                status === f.value
                  ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          <Loader2 size={28} className="animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading cases from MongoDB...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((c) => (
            <div
              key={c.caseId}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold text-slate-500">{c.caseId}</p>
                  <h3 className="mt-1 font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                </div>
                <CaseStatusBadge status={c.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 font-normal leading-relaxed">{c.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400" /> {c.location?.name || "N/A"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" /> {new Date(c.eventDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-slate-400" /> {c.affectedBuildings} structures
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${c.floodPercentage}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700 tabular">{c.floodPercentage}% inundated</span>
                </div>
                <Link to="/map" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                  View GIS Map <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm font-medium text-slate-500">
              No flood cases match your search criteria. Try a different search query or status filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
