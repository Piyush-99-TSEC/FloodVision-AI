import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Calendar, Building2, Plus } from "lucide-react";
import { floodCases } from "../data/mockData";
import { CaseStatus } from "../types";
import { CaseStatusBadge } from "../components/StatusBadge";

const filters: { label: string; value: CaseStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Assessing", value: "assessing" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Closed", value: "closed" },
];

export default function Cases() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CaseStatus | "all">("all");

  const filtered = useMemo(() => {
    return floodCases.filter((c) => {
      const matchesStatus = status === "all" || c.status === status;
      const matchesQuery =
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.location.name.toLowerCase().includes(query.toLowerCase()) ||
        c.caseId.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-100">Flood Cases</h1>
          <p className="text-sm text-slate-400">{filtered.length} of {floodCases.length} cases shown</p>
        </div>
        <Link
          to="/cases/new"
          className="flex items-center gap-1.5 rounded-lg bg-flood-500 px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-glow hover:bg-flood-400"
        >
          <Plus size={16} /> New Case
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 rounded-lg border border-ink-600 bg-ink-800 px-3.5 py-2.5 sm:w-80">
          <Search size={16} className="text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, location or ID..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal size={15} className="shrink-0 text-slate-500" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                status === f.value
                  ? "border-flood-500/40 bg-flood-500/10 text-flood-300"
                  : "border-ink-600 text-slate-400 hover:border-ink-500 hover:text-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((c) => (
          <div
            key={c.caseId}
            className="group rounded-xl border border-ink-700 bg-ink-800 p-5 shadow-panel transition-colors hover:border-flood-500/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-slate-500">{c.caseId}</p>
                <h3 className="mt-1 font-display text-base font-semibold text-slate-100">{c.title}</h3>
              </div>
              <CaseStatusBadge status={c.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-400">{c.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} /> {c.location.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {c.eventDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 size={13} /> {c.affectedBuildings} buildings
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-ink-700 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-600">
                  <div
                    className="h-full rounded-full bg-flood-400"
                    style={{ width: `${c.floodPercentage}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-400 tabular">{c.floodPercentage}% flooded</span>
              </div>
              <Link to="/map" className="text-xs font-medium text-flood-400 group-hover:text-flood-300">
                View Details →
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-ink-600 p-10 text-center text-sm text-slate-500">
            No cases match your search. Try a different keyword or filter.
          </div>
        )}
      </div>
    </div>
  );
}
