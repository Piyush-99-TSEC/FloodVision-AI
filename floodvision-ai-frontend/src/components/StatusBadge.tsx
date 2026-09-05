import { CaseStatus, PriorityLevel } from "../types";

const caseStyles: Record<CaseStatus, string> = {
  active: "bg-blue-50 text-blue-700 border-blue-200",
  assessing: "bg-amber-50 text-amber-700 border-amber-200",
  reviewed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const caseLabels: Record<CaseStatus, string> = {
  active: "Active",
  assessing: "Under Assessment",
  reviewed: "Reviewed",
  closed: "Closed",
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${caseStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {caseLabels[status]}
    </span>
  );
}

const priorityStyles: Record<PriorityLevel, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200 font-bold",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
};

export function PriorityBadge({ level }: { level: PriorityLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs tracking-wide ${priorityStyles[level]}`}
    >
      {level}
    </span>
  );
}
