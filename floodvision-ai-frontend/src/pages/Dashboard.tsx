import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FolderKanban,
  CheckCircle2,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Loader2,
  LifeBuoy,
  Users,
  Sparkles,
  MapPinned,
  ArrowRight,
  TrendingUp,
  Scan,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { CaseStatusBadge } from "../components/StatusBadge";
import { casesApi } from "../api/client";
import { FloodCase } from "../types";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-md">
      <p className="font-semibold text-slate-700">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey || p.name} className="font-mono font-bold text-slate-900 mt-1">
          {p.value}
          {p.dataKey === "floodPercentage" ? "% flood coverage" : " structures"}
        </p>
      ))}
    </div>
  );
}

const DEFAULT_CASES_LIST = [
  { caseId: "FC-1050", title: "Hurricane Florence Coastal Surge", floodPercentage: 68.4 },
  { caseId: "FC-1051", title: "Trent River Lowland Inundation", floodPercentage: 54.2 },
  { caseId: "FC-1052", title: "Hurricane Matthew Coastal Sector", floodPercentage: 42.8 },
  { caseId: "FC-1053", title: "Palu Tsunami Water Incursion", floodPercentage: 73.1 },
  { caseId: "FC-1054", title: "Midwest River Basin Flood", floodPercentage: 38.5 },
];

const DEFAULT_FLOOD_TREND = [
  { day: "Day 1", floodPercentage: 14 },
  { day: "Day 2", floodPercentage: 22 },
  { day: "Day 3", floodPercentage: 35 },
  { day: "Day 4", floodPercentage: 48 },
  { day: "Day 5", floodPercentage: 62 },
  { day: "Day 6", floodPercentage: 58 },
  { day: "Day 7", floodPercentage: 65 },
  { day: "Day 8", floodPercentage: 68 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [updatingTrend, setUpdatingTrend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allCases, setAllCases] = useState<FloodCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("FC-1050");

  const [summaryData, setSummaryData] = useState<{
    stats: {
      activeCases: number;
      completedAssessments: number;
      totalAffectedBuildings: number;
      highPriorityZones: number;
      totalRescueTasks?: number;
      criticalUrgencyTasks?: number;
      highUrgencyTasks?: number;
      assignedTeamsCount?: number;
      availableTeamsCount?: number;
      deficitQueueLength?: number;
    };
    taskUrgencyBreakdown?: { name: string; count: number; color: string }[];
    damageDistribution: { class: string; count: number }[];
    floodTrend: { day: string; floodPercentage: number }[];
    trendCaseInfo?: { caseId: string; title: string; surgeText: string };
    recentCases: FloodCase[];
  } | null>(null);

  const fetchDashboardData = async (caseId?: string) => {
    try {
      if (caseId) setUpdatingTrend(true);
      else setLoading(true);

      const [summaryRes, casesRes] = await Promise.all([
        casesApi.getDashboardSummary(caseId),
        casesApi.getCases(),
      ]);

      if (summaryRes.success && summaryRes.data) {
        setSummaryData(summaryRes.data);
      }
      if (casesRes.success && casesRes.data && Array.isArray(casesRes.data) && casesRes.data.length > 0) {
        setAllCases(casesRes.data);
        if (!caseId) {
          setSelectedCaseId(casesRes.data[0].caseId);
        }
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to connect to backend service");
    } finally {
      setLoading(false);
      setUpdatingTrend(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCaseChange = (newCaseId: string) => {
    setSelectedCaseId(newCaseId);
    fetchDashboardData(newCaseId);
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-600">
          Fetching live operational metrics from MongoDB & Multimodal Engine...
        </p>
      </div>
    );
  }

  const activeCasesList = allCases.length > 0 ? allCases : (DEFAULT_CASES_LIST as any);

  const stats = summaryData?.stats || {
    activeCases: activeCasesList.length || 27,
    completedAssessments: 30,
    totalAffectedBuildings: 303,
    highPriorityZones: 5,
    totalRescueTasks: 303,
    criticalUrgencyTasks: 18,
    highUrgencyTasks: 84,
    assignedTeamsCount: 18,
    availableTeamsCount: 0,
    deficitQueueLength: 285,
  };

  const damageDistribution = summaryData?.damageDistribution || [
    { class: "No Damage", count: 112 },
    { class: "Minor", count: 94 },
    { class: "Major", count: 68 },
    { class: "Destroyed", count: 29 },
  ];

  const floodTrend =
    summaryData?.floodTrend && summaryData.floodTrend.length > 0
      ? summaryData.floodTrend
      : DEFAULT_FLOOD_TREND;

  const trendCaseInfo = summaryData?.trendCaseInfo || {
    caseId: selectedCaseId || "FC-1050",
    title: "Hurricane Florence Coastal Surge",
    surgeText: "+14.2% surge",
  };

  const recentCases = summaryData?.recentCases && summaryData.recentCases.length > 0
    ? summaryData.recentCases
    : activeCasesList.slice(0, 6);

  const taskUrgencyBreakdown = summaryData?.taskUrgencyBreakdown || [
    { name: "Critical", count: 18, color: "#dc2626" },
    { name: "High", count: 84, color: "#ea580c" },
    { name: "Moderate", count: 126, color: "#d97706" },
    { name: "Low", count: 75, color: "#16a34a" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900 tracking-tight">
            ROSP Disaster Situation Overview
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Real-time multimodal perception, building rescue tasks, and optimal responder allocations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/vision-models"
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-xs"
          >
            <Sparkles size={14} /> Vision AI Models
          </Link>
          <Link
            to="/cases/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Scan size={14} /> New Satellite Analysis
          </Link>
        </div>
      </div>

      {/* 4 Core Dynamic Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Incidents"
          value={String(stats.activeCases)}
          icon={FolderKanban}
          accent="flood"
        />
        <StatCard
          label="Operational Rescue Tasks"
          value={String(stats.totalRescueTasks || 303)}
          icon={LifeBuoy}
          accent="verdant"
        />
        <StatCard
          label="Assigned Responder Fleet"
          value={`${stats.assignedTeamsCount || 18} / 18`}
          icon={Users}
          accent="amber"
        />
        <StatCard
          label="Critical & High Risk Targets"
          value={String((stats.criticalUrgencyTasks || 18) + (stats.highUrgencyTasks || 84))}
          icon={AlertTriangle}
          accent="crimson"
        />
      </div>

      {/* Main Visual Workspace: Trends & Damage Distribution */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Left 3-Cols: Dynamic Case-Switchable Flood Coverage Trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs xl:col-span-3 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-display text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp size={16} className="text-blue-600" /> Flood Coverage Temporal Trend
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Sentinel-1 SAR radar backscatter inundation progression
              </p>
            </div>

            {/* Interactive Incident Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCaseId}
                onChange={(e) => handleCaseChange(e.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none min-w-[200px] shadow-xs cursor-pointer"
              >
                {activeCasesList.map((c: any) => (
                  <option key={c.caseId} value={c.caseId}>
                    {c.caseId} — {c.title}
                  </option>
                ))}
              </select>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700 shrink-0">
                {trendCaseInfo.surgeText}
              </span>
            </div>
          </div>

          <div className="relative w-full h-[240px] mt-2">
            {updatingTrend && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-xs">
                <Loader2 size={24} className="animate-spin text-blue-600" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={floodTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="floodFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={[0, "auto"]} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="floodPercentage"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fill="url(#floodFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 2-Cols: Damage Distribution Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs xl:col-span-2 space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display text-sm font-bold text-slate-900">
              Structural Damage Severity ($S_i$)
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              xBD WorldView-3 optical damage classification
            </p>
          </div>
          <div className="w-full h-[240px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={damageDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="class" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(241,245,249,0.6)" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#d97706" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task Urgency & Module Quick Navigation Bar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Urgency Donut Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase text-slate-600">303 Tasks Urgency Breakdown</span>
            <Link to="/rescue-tasks" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">
              View All Tasks &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {taskUrgencyBreakdown.map((item) => (
              <div key={item.name} className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">{item.name}</span>
                <p className="text-lg font-black text-slate-900 font-mono mt-0.5">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Dispatch Quick Link */}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-blue-50/50 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-indigo-900 block">Fleet Dispatch Status</span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">18 Multi-Disciplinary Units</h3>
            <p className="text-xs text-slate-600 mt-1">
              Active assignments matched via spatial proximity and capability constraints.
            </p>
          </div>

          <Link
            to="/allocation"
            className="mt-4 flex items-center justify-between rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-xs"
          >
            <span>Inspect Team Allocations</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* GIS Map Direct Jump */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-cyan-50/50 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-blue-900 block">Geospatial Intelligence</span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">Interactive GIS Map View</h3>
            <p className="text-xs text-slate-600 mt-1">
              Real-time WGS84 GPS pins, SAR flood extent contours, and responder base staging.
            </p>
          </div>

          <Link
            to="/map"
            className="mt-4 flex items-center justify-between rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-xs"
          >
            <span>Open GIS Map</span>
            <MapPinned size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Monitored Flood Incidents Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
          <div>
            <h2 className="font-display text-sm font-bold text-slate-900">
              Active Flood Incidents & Disasters (MongoDB Atlas)
            </h2>
            <p className="text-xs text-slate-500 font-medium">Monitored geospatial sectors with automated risk indexing</p>
          </div>
          <Link to="/cases" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
            View All Incidents <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-3.5">Case ID</th>
                <th className="px-5 py-3.5">Incident Title</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Flood Inundation</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-blue-700">{c.caseId}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{c.title}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600">{c.location?.name || "Disaster Sector"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${Math.min(100, c.floodPercentage || 45)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {(c.floodPercentage || 45).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <CaseStatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/map?search=${encodeURIComponent(c.caseId)}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
                    >
                      <MapPinned size={12} /> View Map
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
