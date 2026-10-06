import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  LifeBuoy,
  Compass,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Loader2,
  Info,
  ArrowRight,
  RefreshCw,
  Zap,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Sparkles,
  Building,
  Anchor,
  Activity,
  HardHat,
  Truck,
} from "lucide-react";
import { assignmentsApi, rescueTeamsApi, rescueTasksApi } from "../api/client";
import {
  RescueTeam,
  TeamAssignment,
  AllocationStatistics,
  RescueTask,
  TeamType,
} from "../types";

const teamTypeIcons: Record<TeamType, React.ElementType> = {
  BOAT_TEAM: Anchor,
  RESCUE_TEAM: LifeBuoy,
  DRONE_TEAM: Compass,
  MEDICAL_TEAM: Activity,
  STRUCTURAL_TEAM: HardHat,
  HEAVY_EQUIPMENT_TEAM: Truck,
};

const teamTypeColors: Record<TeamType, { bg: string; text: string; border: string }> = {
  BOAT_TEAM: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
  RESCUE_TEAM: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  DRONE_TEAM: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  MEDICAL_TEAM: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  STRUCTURAL_TEAM: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  HEAVY_EQUIPMENT_TEAM: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" },
};

export default function TeamAllocation() {
  const [teams, setTeams] = useState<RescueTeam[]>([]);
  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);
  const [tasks, setTasks] = useState<RescueTask[]>([]);
  const [stats, setStats] = useState<AllocationStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [activeTab, setActiveTab] = useState<"assignments" | "fleet" | "deficit">("assignments");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [teamTypeFilter, setTeamTypeFilter] = useState<string>("ALL");
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsRes, assignmentsRes, tasksRes, statsRes] = await Promise.all([
        rescueTeamsApi.getTeams(),
        assignmentsApi.getAssignments(),
        rescueTasksApi.getRescueTasks(),
        assignmentsApi.getAssignmentStats(),
      ]);

      if (teamsRes.success && teamsRes.data?.teams) {
        setTeams(teamsRes.data.teams);
      }
      if (assignmentsRes.success && assignmentsRes.data?.assignments) {
        setAssignments(assignmentsRes.data.assignments);
        if (assignmentsRes.data.assignments.length > 0) {
          setExpandedAssignment(assignmentsRes.data.assignments[0].assignmentId);
        }
      }
      if (tasksRes.success && tasksRes.data?.tasks) {
        setTasks(tasksRes.data.tasks);
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error("Failed to load allocation data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAllocation = async () => {
    try {
      setAllocating(true);
      const res = await assignmentsApi.generateAssignments();
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      console.error("Failed to run team allocation:", err);
    } finally {
      setAllocating(false);
    }
  };

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchUrgency = urgencyFilter === "ALL" || a.urgency === urgencyFilter;
      const matchType = teamTypeFilter === "ALL" || a.teamType === teamTypeFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        a.assignmentId.toLowerCase().includes(q) ||
        a.taskId.toLowerCase().includes(q) ||
        a.teamName.toLowerCase().includes(q) ||
        a.compatibilityReason.toLowerCase().includes(q);

      return matchUrgency && matchType && matchQuery;
    });
  }, [assignments, urgencyFilter, teamTypeFilter, searchQuery]);

  // Unassigned tasks (deficit queue)
  const assignedTaskIds = useMemo(
    () => new Set(assignments.map((a) => a.taskId)),
    [assignments]
  );
  const unassignedTasks = useMemo(
    () => tasks.filter((t) => !assignedTaskIds.has(t.taskId)),
    [tasks, assignedTaskIds]
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">Rescue Team Allocation</h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 border border-indigo-200">
              Module 3 — Optimal Dispatch Strategy
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Explainable priority-based allocation matching emergency responder capabilities with validated building rescue tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAllocation}
            disabled={allocating}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {allocating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Zap size={14} className="text-amber-300" />
            )}
            Run Optimal Allocation
          </button>
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Compass size={14} /> View Map
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Fleet</span>
            <Users size={16} className="text-blue-600" />
          </div>
          <p className="font-display text-2xl font-bold text-slate-900 mt-1">{stats?.totalTeams || teams.length}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5">Simulated Units</p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Assigned Units</span>
            <CheckCircle2 size={16} className="text-blue-700" />
          </div>
          <p className="font-display text-2xl font-bold text-blue-900 mt-1">{stats?.assignedTeams || assignments.length}</p>
          <p className="text-[10px] font-medium text-blue-700 mt-0.5">Active Missions</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Standby Fleet</span>
            <Shield size={16} className="text-emerald-700" />
          </div>
          <p className="font-display text-2xl font-bold text-emerald-900 mt-1">{stats?.availableTeams || 0}</p>
          <p className="text-[10px] font-medium text-emerald-700 mt-0.5">Available for Dispatch</p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800">Unassigned Backlog</span>
            <AlertOctagon size={16} className="text-red-700" />
          </div>
          <p className="font-display text-2xl font-bold text-red-900 mt-1">{stats?.unassignedTasksCount || unassignedTasks.length}</p>
          <p className="text-[10px] font-medium text-red-700 mt-0.5">Resource Deficit Queue</p>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">Avg Proximity</span>
            <Compass size={16} className="text-indigo-700" />
          </div>
          <p className="font-display text-2xl font-bold text-indigo-900 mt-1">{stats?.averageProximityKm || 0} km</p>
          <p className="text-[10px] font-medium text-indigo-700 mt-0.5">Staging-to-Task Distance</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Allocation Score</span>
            <Sparkles size={16} className="text-amber-700" />
          </div>
          <p className="font-display text-2xl font-bold text-amber-900 mt-1">{stats?.averageAllocationScore || 0}</p>
          <p className="text-[10px] font-medium text-amber-700 mt-0.5">Weighted Priority Index</p>
        </div>
      </div>

      {/* Allocation Strategy Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs font-medium text-slate-700">
        <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">
            Explainable Priority-Based Allocation Strategy
          </p>
          <p className="text-slate-600 leading-relaxed">
            Assignments are computed via a composite scoring function:{" "}
            <span className="font-mono font-bold text-blue-700">
              S_alloc = 0.40 × S_priority + 0.35 × S_capability + 0.25 × S_proximity
            </span>
            . Teams are strictly assigned only when capabilities match the task's required resources. Teams obey 1:1 active task capacity constraints.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition-all ${
            activeTab === "assignments"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <CheckCircle2 size={16} /> Active Team Assignments ({assignments.length})
        </button>

        <button
          onClick={() => setActiveTab("fleet")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition-all ${
            activeTab === "fleet"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users size={16} /> Responder Fleet Status ({teams.length})
        </button>

        <button
          onClick={() => setActiveTab("deficit")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition-all ${
            activeTab === "deficit"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <AlertOctagon size={16} /> Resource Deficit Queue ({unassignedTasks.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE ASSIGNMENTS */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 sm:w-72">
              <Search size={14} className="text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by team, task ID, location..."
                className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Urgencies</option>
                <option value="Critical">Critical Urgency</option>
                <option value="High">High Urgency</option>
                <option value="Medium">Medium Urgency</option>
                <option value="Low">Low Urgency</option>
              </select>

              <select
                value={teamTypeFilter}
                onChange={(e) => setTeamTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Team Types</option>
                <option value="BOAT_TEAM">Boat Teams</option>
                <option value="RESCUE_TEAM">Rescue Teams</option>
                <option value="DRONE_TEAM">Drone Teams</option>
                <option value="MEDICAL_TEAM">Medical Units</option>
                <option value="STRUCTURAL_TEAM">Structural Teams</option>
                <option value="HEAVY_EQUIPMENT_TEAM">Heavy Equipment</option>
              </select>
            </div>
          </div>

          {/* Assignments Table */}
          {loading ? (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <p className="text-sm font-semibold text-slate-600">Loading active team assignments...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 font-bold uppercase tracking-wider text-slate-700">
                    <th className="px-5 py-3.5">Assigned Responder Team</th>
                    <th className="px-5 py-3.5">Target Rescue Task</th>
                    <th className="px-5 py-3.5">Transit Distance</th>
                    <th className="px-5 py-3.5">Allocation Score</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssignments.map((a) => {
                    const isOpen = expandedAssignment === a.assignmentId;
                    const Icon = teamTypeIcons[a.teamType] || LifeBuoy;
                    const color = teamTypeColors[a.teamType] || { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" };

                    return (
                      <tr key={a.assignmentId} className="hover:bg-slate-50/80 transition-colors">
                        <td colSpan={6} className="p-0">
                          <div
                            onClick={() => setExpandedAssignment(isOpen ? null : a.assignmentId)}
                            className="flex items-center justify-between px-5 py-3.5 cursor-pointer gap-4"
                          >
                            {/* Team */}
                            <div className="w-1/4">
                              <div className="flex items-center gap-2">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${color.border} ${color.bg} ${color.text}`}>
                                  <Icon size={14} />
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-slate-900 truncate">{a.teamName}</p>
                                  <p className="font-mono text-[10px] text-slate-500">{a.teamId}</p>
                                </div>
                              </div>
                            </div>

                            {/* Task */}
                            <div className="w-1/4">
                              <p className="font-mono font-bold text-blue-700">{a.taskId}</p>
                              <p className="text-[11px] text-slate-500 truncate">{a.taskType}</p>
                            </div>

                            {/* Distance */}
                            <div className="w-1/8">
                              <span className="font-mono font-bold text-slate-800">{a.distanceKm} km</span>
                              <span className="text-[10px] block text-slate-400">Direct Transit</span>
                            </div>

                            {/* Allocation Score */}
                            <div className="w-1/8">
                              <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${a.allocationScore * 100}%` }} />
                                </div>
                                <span className="font-mono font-bold text-blue-700">{a.allocationScore.toFixed(3)}</span>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="w-1/8">
                              <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
                                <Clock size={10} /> {a.assignmentStatus}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <Link
                                to={`/map?taskId=${encodeURIComponent(a.taskId)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
                              >
                                <MapPin size={12} /> Map <ArrowRight size={11} />
                              </Link>
                              <ChevronDown
                                size={16}
                                className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isOpen && (
                            <div className="bg-slate-50/90 border-t border-slate-200 px-6 py-4 space-y-3">
                              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                  Explainable Assignment Compatibility Rationale
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-800 leading-relaxed">
                                  {a.compatibilityReason}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Team Staging Post</span>
                                  <p className="font-semibold text-slate-800 truncate">{a.teamLocation.areaName}</p>
                                  <p className="font-mono text-[10px] text-slate-500">
                                    {a.teamLocation.latitude.toFixed(4)}°N, {a.teamLocation.longitude.toFixed(4)}°E
                                  </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Target Building</span>
                                  <p className="font-semibold text-slate-800 truncate">
                                    Scene: {a.sceneId} (#{a.buildingId})
                                  </p>
                                  <p className="font-mono text-[10px] text-slate-500">
                                    {a.taskLocation.latitude.toFixed(4)}°N, {a.taskLocation.longitude.toFixed(4)}°E
                                  </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Priority & Urgency</span>
                                  <p className="font-semibold text-slate-800">
                                    Risk: {a.riskScore.toFixed(3)} | <span className="font-bold text-red-600">{a.urgency}</span>
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-medium">Assigned: {new Date(a.assignedAt).toLocaleTimeString()}</p>
                                </div>

                                {(() => {
                                  const targetTask = tasks.find((t) => t.taskId === a.taskId);
                                  return (
                                    <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-2.5 shadow-xs space-y-1">
                                      <span className="text-[10px] font-bold uppercase text-blue-900 block flex items-center justify-between">
                                        <span>Multimodal Evidence</span>
                                        <span className="text-[9px] font-normal text-blue-700 font-mono">SAR + Optical</span>
                                      </span>
                                      <div className="text-[11px] space-y-0.5 font-medium text-slate-700">
                                        <div className="flex justify-between">
                                          <span className="text-slate-500">Flood Exp. (Ei):</span>
                                          <span className="font-mono font-bold text-blue-800">{targetTask && typeof targetTask.floodExposure === 'number' ? targetTask.floodExposure.toFixed(2) : "0.50"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-500">Damage Sev. (Si):</span>
                                          <span className="font-mono font-bold text-red-700">{targetTask && typeof targetTask.damageSeverity === 'number' ? targetTask.damageSeverity.toFixed(2) : "0.50"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-500">Bldg Area:</span>
                                          <span className="font-mono text-slate-700">{targetTask?.location?.areaPixels ? `${targetTask.location.areaPixels} px²` : "40 px²"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm font-medium text-slate-500">
                        No team assignments match the selected filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESPONDER FLEET STATUS */}
      {activeTab === "fleet" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => {
            const Icon = teamTypeIcons[team.teamType] || LifeBuoy;
            const color = teamTypeColors[team.teamType] || { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" };
            const isAssigned = team.status === "ASSIGNED";

            return (
              <div key={team.teamId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${color.border} ${color.bg} ${color.text}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-900">{team.teamName}</h3>
                      <span className="font-mono text-[10px] font-semibold text-slate-400">{team.teamId}</span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      isAssigned
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {team.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Staging Location:</span>
                    <span className="font-medium text-slate-900 text-right">{team.currentLocation.areaName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Personnel:</span>
                    <span className="font-bold text-slate-900">{team.personnelCount} responders</span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Capabilities</span>
                  <div className="flex flex-wrap gap-1">
                    {team.capabilities.map((c) => (
                      <span key={c} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {isAssigned && team.assignedTaskId && (
                  <div className="rounded-lg bg-blue-50/80 p-2.5 border border-blue-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-700 block">Active Mission Target</span>
                      <span className="font-mono font-bold text-slate-900 text-[11px]">{team.assignedTaskId}</span>
                    </div>
                    <Link
                      to={`/map?taskId=${encodeURIComponent(team.assignedTaskId)}`}
                      className="rounded bg-blue-600 text-white p-1.5 hover:bg-blue-700 transition-colors"
                      title="Inspect on Map"
                    >
                      <MapPin size={13} />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: RESOURCE DEFICIT QUEUE */}
      {activeTab === "deficit" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <p className="font-semibold">
              Showing {unassignedTasks.length} unassigned tasks awaiting additional emergency responder deployment.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/90 font-bold uppercase tracking-wider text-slate-700">
                  <th className="px-5 py-3.5">Task ID & Scene</th>
                  <th className="px-5 py-3.5">Task Type</th>
                  <th className="px-5 py-3.5">Urgency</th>
                  <th className="px-5 py-3.5">Required Resources</th>
                  <th className="px-5 py-3.5">Queue Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unassignedTasks.slice(0, 50).map((t) => (
                  <tr key={t.taskId} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3">
                      <p className="font-mono font-bold text-slate-900">{t.taskId}</p>
                      <p className="text-[11px] text-slate-500">{t.sceneId} (Bldg #{t.buildingId})</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-700">{t.taskType}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200 uppercase">
                        {t.urgency}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.requiredResources.map((r) => (
                          <span key={r} className="rounded bg-red-50 px-1.5 py-0.2 text-[9px] font-bold text-red-700 border border-red-200">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                        STANDBY (Resource Deficit)
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/map?taskId=${encodeURIComponent(t.taskId)}`}
                        className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <MapPin size={12} /> Pin
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
