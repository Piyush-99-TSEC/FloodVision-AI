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
import { FolderKanban, CheckCircle2, Building2, AlertTriangle, ArrowUpRight } from "lucide-react";
import StatCard from "../components/StatCard";
import { CaseStatusBadge } from "../components/StatusBadge";
import { floodCases, floodTrend, damageDistribution } from "../data/mockData";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-xs shadow-panel">
      <p className="text-slate-400">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-mono font-semibold text-slate-100">
          {p.value}
          {p.dataKey === "floodPercentage" ? "%" : ""}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const activeCases = floodCases.filter((c) => c.status === "active" || c.status === "assessing").length;
  const completedAssessments = floodCases.filter((c) => c.status === "reviewed" || c.status === "closed").length;
  const totalAffectedBuildings = floodCases.reduce((s, c) => s + c.affectedBuildings, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-100">Situation Overview</h1>
          <p className="text-sm text-slate-400">Live summary across all monitored flood cases.</p>
        </div>
        <Link
          to="/cases/new"
          className="rounded-lg bg-flood-500 px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-glow hover:bg-flood-400"
        >
          + New Flood Case
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Cases" value={String(activeCases)} icon={FolderKanban} accent="flood" />
        <StatCard
          label="Completed Assessments"
          value={String(completedAssessments)}
          icon={CheckCircle2}
          accent="verdant"
        />
        <StatCard
          label="Affected Buildings"
          value={totalAffectedBuildings.toLocaleString()}
          icon={Building2}
          accent="amber"
        />
        <StatCard label="High-Priority Zones" value="2" icon={AlertTriangle} accent="crimson" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-xl border border-ink-700 bg-ink-800 p-5 shadow-panel xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold text-slate-100">Flood Coverage Trend</h2>
              <p className="text-xs text-slate-500">FC-1042 · Kolar Riverbank — last 8 days</p>
            </div>
            <span className="rounded-full bg-flood-500/10 px-2.5 py-1 font-mono text-xs text-flood-400">+8.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={floodTrend}>
              <defs>
                <linearGradient id="floodFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3DD6E3" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3DD6E3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#16213A" vertical={false} />
              <XAxis dataKey="day" stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="floodPercentage"
                stroke="#3DD6E3"
                strokeWidth={2}
                fill="url(#floodFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800 p-5 shadow-panel xl:col-span-2">
          <div className="mb-4">
            <h2 className="font-display text-sm font-semibold text-slate-100">Damage Distribution</h2>
            <p className="text-xs text-slate-500">Aggregated across active assessments</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={damageDistribution}>
              <CartesianGrid stroke="#16213A" vertical={false} />
              <XAxis dataKey="class" stroke="#6B7690" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#F5A524" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <h2 className="font-display text-sm font-semibold text-slate-100">Recent Flood Cases</h2>
          <Link to="/cases" className="flex items-center gap-1 text-xs text-flood-400 hover:text-flood-300">
            View all <ArrowUpRight size={13} />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-medium">Case ID</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Flood %</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {floodCases.slice(0, 5).map((c) => (
              <tr key={c.caseId} className="border-t border-ink-700/60 hover:bg-ink-700/30">
                <td className="px-5 py-3 font-mono text-xs text-slate-400">{c.caseId}</td>
                <td className="px-5 py-3 font-medium text-slate-100">{c.title}</td>
                <td className="px-5 py-3 text-slate-400">{c.location.name}</td>
                <td className="px-5 py-3 font-mono text-slate-300 tabular">{c.floodPercentage}%</td>
                <td className="px-5 py-3">
                  <CaseStatusBadge status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
