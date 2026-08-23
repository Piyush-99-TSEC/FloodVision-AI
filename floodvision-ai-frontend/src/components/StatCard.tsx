import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "flood" | "amber" | "crimson" | "verdant";
  trend?: ReactNode;
}

const accentMap = {
  flood: "text-flood-400 bg-flood-500/10",
  amber: "text-amber-400 bg-amber-500/10",
  crimson: "text-crimson-400 bg-crimson-500/10",
  verdant: "text-verdant-400 bg-verdant-500/10",
};

export default function StatCard({ label, value, icon: Icon, accent = "flood", trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 p-5 shadow-panel">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-100 tabular">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${accentMap[accent]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      {trend && <div className="mt-3 text-xs text-slate-400">{trend}</div>}
    </div>
  );
}
