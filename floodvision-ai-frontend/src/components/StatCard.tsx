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
  flood: "text-blue-700 bg-blue-50 border-blue-200",
  amber: "text-amber-700 bg-amber-50 border-amber-200",
  crimson: "text-red-700 bg-red-50 border-red-200",
  verdant: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

export default function StatCard({ label, value, icon: Icon, accent = "flood", trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-sm hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-900 tabular">{value}</p>
        </div>
        <div className={`rounded-lg border p-2.5 ${accentMap[accent]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      {trend && <div className="mt-3 text-xs text-slate-600 font-medium">{trend}</div>}
    </div>
  );
}
