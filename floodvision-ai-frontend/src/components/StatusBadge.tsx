import { CaseStatus, PriorityLevel } from "../types";

const caseStyles: Record<CaseStatus, string> = {
  active: "bg-flood-500/10 text-flood-300 border-flood-500/30",
  assessing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  reviewed: "bg-verdant-500/10 text-verdant-400 border-verdant-500/30",
  closed: "bg-ink-600/40 text-slate-400 border-ink-500/40",
};

const caseLabels: Record<CaseStatus, string> = {
  active: "Active",
  assessing: "Assessing",
  reviewed: "Reviewed",
  closed: "Closed",
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${caseStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {caseLabels[status]}
    </span>
  );
}

const priorityStyles: Record<PriorityLevel, string> = {
  HIGH: "bg-crimson-500/10 text-crimson-400 border-crimson-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  LOW: "bg-verdant-500/10 text-verdant-400 border-verdant-500/30",
};

export function PriorityBadge({ level }: { level: PriorityLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${priorityStyles[level]}`}
    >
      {level}
    </span>
  );
}
