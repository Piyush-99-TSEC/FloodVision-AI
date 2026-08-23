import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { rescuePriorities } from "../data/mockData";
import { PriorityBadge } from "../components/StatusBadge";

const barColor = { HIGH: "bg-crimson-500", MEDIUM: "bg-amber-500", LOW: "bg-verdant-500" } as const;

export default function Priority() {
  const [expanded, setExpanded] = useState<string | null>(rescuePriorities[0].assessmentId);

  const sorted = [...rescuePriorities].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-100">Rescue Priority Matrix</h1>
        <p className="text-sm text-slate-400">
          Zones ranked by a transparent, factor-based scoring model — not an unexplained AI decision.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-flood-500/20 bg-flood-500/5 p-4 text-sm text-slate-300">
        <Info size={16} className="mt-0.5 shrink-0 text-flood-400" />
        <p>
          Every score below is reproducible from four weighted factors: flood severity, building damage
          density, population exposure and access-road status. Expand a row to view the exact contribution
          of each factor.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3.5 font-medium">Zone</th>
              <th className="px-5 py-3.5 font-medium">Score</th>
              <th className="px-5 py-3.5 font-medium">Priority</th>
              <th className="px-5 py-3.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const isOpen = expanded === p.assessmentId;
              return (
                <>
                  <tr
                    key={p.assessmentId}
                    onClick={() => setExpanded(isOpen ? null : p.assessmentId)}
                    className="cursor-pointer border-b border-ink-700/60 hover:bg-ink-700/30"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-100">{p.area}</p>
                      <p className="font-mono text-xs text-slate-500">{p.assessmentId}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-600">
                          <div
                            className={`h-full rounded-full ${barColor[p.priorityLevel]}`}
                            style={{ width: `${p.score * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-300 tabular">{p.score.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <PriorityBadge level={p.priorityLevel} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ChevronDown
                        size={16}
                        className={`inline text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-ink-700/60 bg-ink-900/40">
                      <td colSpan={4} className="px-5 py-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                          Contributing Factors
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {p.factors.map((f) => (
                            <div key={f.label} className="rounded-lg border border-ink-700 bg-ink-800 p-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-300">{f.label}</span>
                                <span className="font-mono text-slate-400 tabular">{f.weight.toFixed(2)}</span>
                              </div>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-600">
                                <div
                                  className="h-full rounded-full bg-flood-400"
                                  style={{ width: `${(f.weight / 0.5) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
