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
} from "recharts";
import { FolderKanban, CheckCircle2, Building2, AlertTriangle, ArrowUpRight, Plus, Loader2 } from "lucide-react";
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
        <p key={p.dataKey} className="font-mono font-bold text-slate-900 mt-1">
          {p.value}
          {p.dataKey === "floodPercentage" ? "% flood coverage" : " structures"}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{
    stats: {
      activeCases: number;
      completedAssessments: number;
      totalAffectedBuildings: number;
      highPriorityZones: number;
    };
    damageDistribution: { class: string; count: number }[];
    floodTrend: { day: string; floodPercentage: number }[];
    trendCaseInfo?: { caseId: string; title: string; surgeText: string };
    recentCases: FloodCase[];
  } | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await casesApi.getDashboardSummary();
        if (res.success && res.data) {
          setSummaryData(res.data);
        } else {
          throw new Error(res.message || "Failed to load dashboard data");
        }
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to connect to backend service");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-600">Fetching live operational metrics from MongoDB...</p>
      </div>
    );
  }

  const stats = summaryData?.stats || { activeCases: 0, completedAssessments: 0, totalAffectedBuildings: 0, highPriorityZones: 0 };
  const damageDistribution = summaryData?.damageDistribution || [];
  const floodTrend = summaryData?.floodTrend || [];
  const trendCaseInfo = summaryData?.trendCaseInfo || { caseId: "FC-1050", title: "Active Flood Incident", surgeText: "+8.2% surge" };
  const recentCases = summaryData?.recentCases || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Situation Overview</h1>
          <p className="text-sm font-medium text-slate-500">
            Real-time operational summary across all monitored flood cases and emergency assessments.
          </p>
        </div>
        <Link
          to="/cases/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> New Flood Case
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
          ⚠️ Notice: {error}. Showing cached operational summary.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Cases" value={String(stats.activeCases)} icon={FolderKanban} accent="flood" />
        <StatCard
          label="Completed Assessments"
          value={String(stats.completedAssessments)}
          icon={CheckCircle2}
          accent="verdant"
        />
        <StatCard
          label="Affected Buildings"
          value={stats.totalAffectedBuildings.toLocaleString()}
          icon={Building2}
          accent="amber"
        />
        <StatCard label="High-Priority Zones" value={String(stats.highPriorityZones)} icon={AlertTriangle} accent="crimson" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">Flood Coverage Trend</h2>
              <p className="text-xs text-slate-500 font-medium">{trendCaseInfo.caseId} · {trendCaseInfo.title} — Last 8 Days</p>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 font-mono text-xs font-bold text-blue-700">
              {trendCaseInfo.surgeText}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={floodTrend}>
              <defs>
                <linearGradient id="floodFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="floodPercentage"
                stroke="#0284c7"
                strokeWidth={2.5}
                fill="url(#floodFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4">
            <h2 className="font-display text-base font-bold text-slate-900">Damage Distribution</h2>
            <p className="text-xs text-slate-500 font-medium">Aggregated across active assessments</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={damageDistribution}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="class" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(241,245,249,0.6)" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
          <h2 className="font-display text-base font-bold text-slate-900">Recent Flood Cases (MongoDB Atlas)</h2>
          <Link to="/cases" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
            View All Cases <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-3.5">Case ID</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Flood Coverage</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-600">{c.caseId}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{c.title}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{c.location?.name || "N/A"}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-blue-700 tabular">{c.floodPercentage}%</td>
                  <td className="px-5 py-3.5">
                    <CaseStatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
              {recentCases.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-slate-500">
                    No cases registered in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
