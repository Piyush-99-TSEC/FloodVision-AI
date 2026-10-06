import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  Loader2,
  Info,
  LifeBuoy,
  Users,
  Compass,
  ArrowRight,
  RefreshCw,
  Building,
} from "lucide-react";
import { rescueTasksApi, assignmentsApi } from "../api/client";
import { RescueTask, TaskStatistics, TaskUrgency, TaskType, TeamAssignment } from "../types";

const urgencyConfig: Record<
  TaskUrgency,
  { label: string; bg: string; text: string; border: string; bar: string }
> = {
  Critical: {
    label: "Critical Urgency",
    bg: "bg-red-100",
    text: "text-red-900",
    border: "border-red-300",
    bar: "bg-red-700",
  },
  High: {
    label: "High Urgency",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    bar: "bg-red-600",
  },
  Medium: {
    label: "Medium Urgency",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    bar: "bg-amber-500",
  },
  Low: {
    label: "Low Urgency",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    bar: "bg-emerald-600",
  },
};

const taskTypeColors: Record<string, string> = {
  "Immediate Rescue / Evacuation Assessment": "bg-red-50 text-red-800 border-red-200",
  "Structural Safety / Rescue Assessment": "bg-amber-50 text-amber-800 border-amber-200",
  "Priority Welfare Check / Inspection": "bg-blue-50 text-blue-800 border-blue-200",
  "Monitoring / Routine Assessment": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function RescueTasks() {
  const [tasks, setTasks] = useState<RescueTask[]>([]);
  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);
  const [stats, setStats] = useState<TaskStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<"ALL" | TaskUrgency>("ALL");
  const [taskTypeFilter, setTaskTypeFilter] = useState<"ALL" | TaskType>("ALL");
  const [sceneFilter, setSceneFilter] = useState<string>("ALL");

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, statsRes, asgRes] = await Promise.all([
        rescueTasksApi.getRescueTasks(),
        rescueTasksApi.getRescueTaskStats(),
        assignmentsApi.getAssignments(),
      ]);

      if (tasksRes.success && tasksRes.data?.tasks) {
        setTasks(tasksRes.data.tasks);
        if (tasksRes.data.tasks.length > 0) {
          setExpandedTask(tasksRes.data.tasks[0].taskId);
        }
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (asgRes.success && asgRes.data?.assignments) {
        setAssignments(asgRes.data.assignments);
      }
    } catch (err) {
      console.error("Failed to load rescue tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Unique scenes for filter dropdown
  const uniqueScenes = useMemo(() => {
    const set = new Set(tasks.map((t) => t.sceneId));
    return Array.from(set).sort();
  }, [tasks]);

  // Filtered task records
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchUrgency = urgencyFilter === "ALL" || t.urgency === urgencyFilter;
      const matchType = taskTypeFilter === "ALL" || t.taskType === taskTypeFilter;
      const matchScene = sceneFilter === "ALL" || t.sceneId === sceneFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        t.taskId.toLowerCase().includes(q) ||
        t.sceneId.toLowerCase().includes(q) ||
        t.taskType.toLowerCase().includes(q) ||
        t.taskReason.toLowerCase().includes(q) ||
        t.requiredResources.some((r) => r.toLowerCase().includes(q));

      return matchUrgency && matchType && matchScene && matchQuery;
    });
  }, [tasks, urgencyFilter, taskTypeFilter, sceneFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">Rescue Task Generation</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 border border-blue-200">
              Module 2 — 303 Validated Buildings
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Operational action tasks generated deterministically from frozen multimodal risk scores (Ri) and flood exposure (Ei/Si).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Refresh Tasks"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <MapPin size={14} /> Open GIS Map
          </Link>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Tasks</span>
            <Building size={18} className="text-blue-600" />
          </div>
          <p className="font-display text-2xl font-bold text-slate-900 mt-1">{stats?.totalTasks || tasks.length}</p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">30 Disaster Scenes</p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">Critical Urgency</span>
            <ShieldAlert size={18} className="text-red-700" />
          </div>
          <p className="font-display text-2xl font-bold text-red-900 mt-1">
            {stats?.urgencyCounts.Critical ?? tasks.filter((t) => t.urgency === "Critical").length}
          </p>
          <p className="text-[11px] font-medium text-red-700 mt-0.5">Ri ≥ 0.75 (Priority 1)</p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/20 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">High Urgency</span>
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <p className="font-display text-2xl font-bold text-red-800 mt-1">
            {stats?.urgencyCounts.High ?? tasks.filter((t) => t.urgency === "High").length}
          </p>
          <p className="text-[11px] font-medium text-red-600 mt-0.5">0.50 ≤ Ri &lt; 0.75</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Medium Urgency</span>
            <Clock size={18} className="text-amber-600" />
          </div>
          <p className="font-display text-2xl font-bold text-amber-900 mt-1">
            {stats?.urgencyCounts.Medium ?? tasks.filter((t) => t.urgency === "Medium").length}
          </p>
          <p className="text-[11px] font-medium text-amber-700 mt-0.5">0.25 ≤ Ri &lt; 0.50</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Low Urgency</span>
            <CheckCircle size={18} className="text-emerald-600" />
          </div>
          <p className="font-display text-2xl font-bold text-emerald-900 mt-1">
            {stats?.urgencyCounts.Low ?? tasks.filter((t) => t.urgency === "Low").length}
          </p>
          <p className="text-[11px] font-medium text-emerald-700 mt-0.5">Ri &lt; 0.25 (Routine)</p>
        </div>
      </div>

      {/* Operational Rationale Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs font-medium text-slate-700">
        <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">
            Task Generation Architecture: Separation of Impact Risk vs Operational Urgency
          </p>
          <p className="text-slate-600 leading-relaxed">
            Building-level risk scores (Ri) remain frozen and read-only. Tasks convert compound risk and environmental evidence
            (Ei flood exposure &amp; Si damage severity) into actionable field operations. Initial task status is <span className="font-mono font-bold text-blue-700">PENDING</span> in preparation for the upcoming Optimal Team Allocation stage.
          </p>
        </div>
      </div>

      {/* Search & Multi-filter Controls */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search bar */}
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Task ID, scene, resource..."
              className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Urgency Levels</option>
              <option value="Critical">Critical Urgency</option>
              <option value="High">High Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="Low">Low Urgency</option>
            </select>
          </div>

          {/* Task Type Filter */}
          <div>
            <select
              value={taskTypeFilter}
              onChange={(e) => setTaskTypeFilter(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Task Types</option>
              <option value="Immediate Rescue / Evacuation Assessment">Immediate Rescue / Evacuation</option>
              <option value="Structural Safety / Rescue Assessment">Structural Safety / Rescue</option>
              <option value="Priority Welfare Check / Inspection">Priority Welfare Check</option>
              <option value="Monitoring / Routine Assessment">Monitoring / Routine Assessment</option>
            </select>
          </div>

          {/* Scene Filter */}
          <div>
            <select
              value={sceneFilter}
              onChange={(e) => setSceneFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Disaster Scenes ({uniqueScenes.length})</option>
              {uniqueScenes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Badges Strip */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-600">
              Showing {filteredTasks.length} of {tasks.length} Generated Tasks
            </span>
          </div>
          {(urgencyFilter !== "ALL" || taskTypeFilter !== "ALL" || sceneFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setUrgencyFilter("ALL");
                setTaskTypeFilter("ALL");
                setSceneFilter("ALL");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task Table View */}
      {loading ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Loading generated rescue tasks from API...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/90 font-bold uppercase tracking-wider text-slate-700">
                <th className="px-5 py-3.5">Task ID & Scene</th>
                <th className="px-5 py-3.5">Task Type & Operations</th>
                <th className="px-5 py-3.5">Risk Score (Ri)</th>
                <th className="px-5 py-3.5">Urgency</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => {
                const isOpen = expandedTask === t.taskId;
                const urg = urgencyConfig[t.urgency] || urgencyConfig.Low;
                const typeStyle = taskTypeColors[t.taskType] || "bg-slate-100 text-slate-700";

                return (
                  <tr key={t.taskId} className="hover:bg-slate-50/80 transition-colors">
                    <td colSpan={6} className="p-0">
                      {/* Summary Row */}
                      <div
                        onClick={() => setExpandedTask(isOpen ? null : t.taskId)}
                        className="flex items-center justify-between px-5 py-3.5 cursor-pointer gap-4"
                      >
                        {/* Task ID & Scene */}
                        <div className="w-1/4">
                          <p className="font-mono font-bold text-blue-700 text-xs">{t.taskId}</p>
                          <p className="text-[11px] font-medium text-slate-500 truncate" title={t.sceneId}>
                            {t.sceneId} (Bldg #{t.buildingId})
                          </p>
                        </div>

                        {/* Task Type */}
                        <div className="w-1/3">
                          <span className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold border ${typeStyle}`}>
                            {t.taskType}
                          </span>
                        </div>

                        {/* Risk Score */}
                        <div className="w-1/6">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                              <div className={`h-full rounded-full ${urg.bar}`} style={{ width: `${t.riskScore * 100}%` }} />
                            </div>
                            <span className="font-mono font-bold text-slate-900">{t.riskScore.toFixed(3)}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">{t.riskCategory} Risk</span>
                        </div>

                        {/* Urgency */}
                        <div className="w-1/8">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${urg.bg} ${urg.text} ${urg.border}`}>
                            {t.urgency}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="w-1/8">
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                            <Clock size={11} className="text-slate-500" /> {t.taskStatus}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to={`/map?taskId=${encodeURIComponent(t.taskId)}&search=${encodeURIComponent(t.sceneId)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
                          >
                            <Compass size={13} /> GIS Pin <ArrowRight size={11} />
                          </Link>
                          <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>

                      {/* Expanded Details Pane */}
                      {isOpen && (
                        <div className="bg-slate-50/90 border-t border-slate-200 px-6 py-4 space-y-3">
                          {/* Reason */}
                          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Operational Task Generation Rationale
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-800 leading-relaxed">{t.taskReason}</p>
                          </div>

                          {/* Assigned Team Banner if allocated */}
                          {(() => {
                            const asg = assignments.find((a) => a.taskId === t.taskId);
                            if (asg) {
                              return (
                                <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block flex items-center gap-1">
                                      <Users size={12} /> Assigned Response Unit
                                    </span>
                                    <p className="text-xs font-bold text-slate-900">
                                      {asg.teamName} <span className="font-mono text-[10px] text-slate-500 font-normal">({asg.teamId})</span>
                                    </p>
                                    <p className="text-[11px] text-slate-600 font-medium">
                                      Transit: <span className="font-mono font-bold text-slate-800">{asg.distanceKm} km</span> from {asg.teamLocation.areaName} | Allocation Score: <span className="font-mono font-bold text-blue-700">{asg.allocationScore.toFixed(3)}</span>
                                    </p>
                                  </div>
                                  <Link
                                    to="/allocation"
                                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs shrink-0"
                                  >
                                    Manage Allocation <ArrowRight size={12} />
                                  </Link>
                                </div>
                              );
                            }
                            return (
                              <div className="rounded-lg bg-slate-100 border border-slate-200 p-2.5 text-xs font-medium text-slate-600 flex items-center justify-between">
                                <span>No team assigned yet (Task in Resource Deficit Queue).</span>
                                <Link
                                  to="/allocation"
                                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  Assign Team <ArrowRight size={11} />
                                </Link>
                              </div>
                            );
                          })()}

                          {/* Detail Grid */}
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Evidence & Metrics */}
                            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-1.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Multimodal Evidence</p>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Flood Exposure (Ei):</span>
                                <span className="font-mono font-bold text-blue-700">{t.floodExposure.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Damage Severity (Si):</span>
                                <span className="font-mono font-bold text-red-700">{t.damageSeverity.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Building Area:</span>
                                <span className="font-mono text-slate-700">{t.location.areaPixels} px²</span>
                              </div>
                            </div>

                            {/* Geo Location */}
                            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-1.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Geographic Coordinates</p>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Latitude:</span>
                                <span className="font-mono text-slate-800">{t.location.latitude.toFixed(6)}°N</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Longitude:</span>
                                <span className="font-mono text-slate-800">{t.location.longitude.toFixed(6)}°E</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Pixel Centroid:</span>
                                <span className="font-mono text-slate-500">({t.location.centroidX.toFixed(1)}, {t.location.centroidY.toFixed(1)})</span>
                              </div>
                            </div>

                            {/* Required Resources */}
                            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                <LifeBuoy size={12} className="text-blue-600" /> Recommended Resources
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {t.requiredResources.map((res) => (
                                  <span key={res} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                                    {res}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Estimated Personnel */}
                            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-1.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                <Users size={12} className="text-indigo-600" /> Estimated Personnel
                              </p>
                              <p className="text-xs font-semibold text-slate-900">{t.estimatedPersonnel}</p>
                              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                                Planning estimate for subsequent Team Allocation Module.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm font-medium text-slate-500">
                    No rescue tasks match the current filter criteria.
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
