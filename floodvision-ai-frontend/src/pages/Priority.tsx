import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Info, ChevronDown, Loader2, Search, SlidersHorizontal, AlertTriangle, ShieldAlert, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import { PriorityBadge } from "../components/StatusBadge";
import { resultsApi } from "../api/client";
import { RescuePriority } from "../types";

const barColor = { HIGH: "bg-red-600", MEDIUM: "bg-amber-600", LOW: "bg-emerald-600" } as const;

export default function Priority() {
  const [priorities, setPriorities] = useState<RescuePriority[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  useEffect(() => {
    async function fetchPriorities() {
      try {
        setLoading(true);
        const res = await resultsApi.getRescuePriorities();
        if (res.success && res.data) {
          setPriorities(res.data);
          if (res.data.length > 0) {
            setExpanded(res.data[0].assessmentId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch rescue priorities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPriorities();
  }, []);

  const filtered = useMemo(() => {
    return priorities
      .filter((p) => {
        const matchesLevel = filterLevel === "ALL" || p.priorityLevel === filterLevel;
        const matchesQuery =
          p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.assessmentId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesLevel && matchesQuery;
      })
      .sort((a, b) => b.score - a.score);
  }, [priorities, searchQuery, filterLevel]);

  // Group zones into 3 priority clusters
  const highCluster = useMemo(() => filtered.filter((p) => p.priorityLevel === "HIGH"), [filtered]);
  const mediumCluster = useMemo(() => filtered.filter((p) => p.priorityLevel === "MEDIUM"), [filtered]);
  const lowCluster = useMemo(() => filtered.filter((p) => p.priorityLevel === "LOW"), [filtered]);

  const totalHigh = priorities.filter((p) => p.priorityLevel === "HIGH").length;
  const totalMedium = priorities.filter((p) => p.priorityLevel === "MEDIUM").length;
  const totalLow = priorities.filter((p) => p.priorityLevel === "LOW").length;

  const renderClusterRows = (clusterData: RescuePriority[]) => {
    return clusterData.map((p) => {
      const isOpen = expanded === p.assessmentId;
      const cityName = p.area.split(" (")[1]?.replace(")", "") || p.area;

      return (
        <tr key={p.assessmentId} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
          <td colSpan={4} className="p-0">
            <div
              onClick={() => setExpanded(isOpen ? null : p.assessmentId)}
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer gap-4"
            >
              <div className="w-2/5">
                <p className="font-semibold text-slate-900">{p.area}</p>
                <p className="font-mono text-xs text-slate-500">{p.assessmentId}</p>
              </div>
              <div className="w-1/4 flex items-center gap-3">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                  <div
                    className={`h-full rounded-full ${barColor[p.priorityLevel]}`}
                    style={{ width: `${p.score * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-slate-900 tabular">{p.score.toFixed(2)}</span>
              </div>
              <div className="w-1/6">
                <PriorityBadge level={p.priorityLevel} />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/map?search=${encodeURIComponent(cityName)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-xs"
                >
                  <MapPin size={13} className="text-blue-600" /> View Map <ArrowRight size={12} />
                </Link>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {isOpen && (
              <div className="bg-slate-50/80 border-t border-slate-200 px-5 py-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Contributing Weighted Factors
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {p.factors.map((f) => (
                    <div key={f.label} className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 font-semibold">{f.label}</span>
                        <span className="font-mono font-bold text-blue-700 tabular">{f.weight.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${(f.weight / 0.5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Rescue Priority Matrix</h1>
          <p className="text-sm font-medium text-slate-500">
            Emergency response zones clustered by risk severity for optimal rescue resource allocation (MongoDB Atlas).
          </p>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/60 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-800">High Priority Cluster</p>
            <p className="font-display text-2xl font-bold text-red-900 mt-1">{totalHigh} Zones</p>
          </div>
          <ShieldAlert size={28} className="text-red-600" />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Medium Priority Cluster</p>
            <p className="font-display text-2xl font-bold text-amber-900 mt-1">{totalMedium} Zones</p>
          </div>
          <AlertTriangle size={28} className="text-amber-600" />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Low Priority Cluster</p>
            <p className="font-display text-2xl font-bold text-emerald-900 mt-1">{totalLow} Zones</p>
          </div>
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm font-medium text-slate-700">
        <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
        <p>
          Rescue priority zones are clustered into High, Medium, and Low Risk Groups based on weighted multi-factor AI scores. Click any zone to view individual factor weights.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 sm:w-80 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by zone sector or assessment ID..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <SlidersHorizontal size={15} className="shrink-0 text-slate-500" />
          {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filterLevel === lvl
                  ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {lvl === "ALL" ? "All Clusters" : `${lvl} Cluster`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          <Loader2 size={28} className="animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading rescue priority clusters from backend database...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                <th className="px-5 py-3.5">Zone & Sector</th>
                <th className="px-5 py-3.5">Priority Score</th>
                <th className="px-5 py-3.5">Priority Tier</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {/* HIGH PRIORITY CLUSTER */}
              {highCluster.length > 0 && (
                <>
                  <tr className="bg-red-50/80 border-y border-red-200">
                    <td colSpan={4} className="px-5 py-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-red-900">
                        <span className="flex items-center gap-2">
                          <ShieldAlert size={16} className="text-red-600 shrink-0" />
                          HIGH PRIORITY RESCUE CLUSTER ({highCluster.length} Zones)
                        </span>
                        <span className="text-[11px] font-semibold text-red-700">
                          Directive: Air-Drop & Motorboat Deployment
                        </span>
                      </div>
                    </td>
                  </tr>
                  {renderClusterRows(highCluster)}
                </>
              )}

              {/* MEDIUM PRIORITY CLUSTER */}
              {mediumCluster.length > 0 && (
                <>
                  <tr className="bg-amber-50/80 border-y border-amber-200">
                    <td colSpan={4} className="px-5 py-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                          MEDIUM PRIORITY RESCUE CLUSTER ({mediumCluster.length} Zones)
                        </span>
                        <span className="text-[11px] font-semibold text-amber-800">
                          Directive: Supply Distribution & Boat Support
                        </span>
                      </div>
                    </td>
                  </tr>
                  {renderClusterRows(mediumCluster)}
                </>
              )}

              {/* LOW PRIORITY CLUSTER */}
              {lowCluster.length > 0 && (
                <>
                  <tr className="bg-emerald-50/80 border-y border-emerald-200">
                    <td colSpan={4} className="px-5 py-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                          LOW PRIORITY SURVEILLANCE CLUSTER ({lowCluster.length} Zones)
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800">
                          Directive: Regular Surveillance & Monitoring
                        </span>
                      </div>
                    </td>
                  </tr>
                  {renderClusterRows(lowCluster)}
                </>
              )}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm font-medium text-slate-500">
                    No rescue priority clusters match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
