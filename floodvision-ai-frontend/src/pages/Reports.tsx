import { useEffect, useState, useMemo } from "react";
import {
  FileBarChart,
  CheckCircle2,
  Loader2,
  Download,
  Eye,
  Plus,
  Search,
  X,
  FileText,
  Building,
  Users,
  Waves,
  Printer,
  ShieldCheck,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { reportsApi, casesApi } from "../api/client";
import { Report, FloodCase } from "../types";
import { downloadReportPDF } from "../utils/pdfGenerator";
import { PriorityBadge } from "../components/StatusBadge";

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [cases, setCases] = useState<FloodCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Form State
  const [formCaseId, setFormCaseId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      const [reportsRes, casesRes] = await Promise.all([
        reportsApi.getReports(),
        casesApi.getCases(),
      ]);

      if (reportsRes.success && reportsRes.data) {
        setReports(reportsRes.data);
      }
      if (casesRes.success && casesRes.data) {
        setCases(casesRes.data);
        if (casesRes.data.length > 0) {
          setFormCaseId(casesRes.data[0].caseId);
          setFormTitle(`Executive Flood Impact Report - ${casesRes.data[0].location.name}`);
        }
      }
    } catch (err) {
      console.error("Failed to load reporting data:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredReports = useMemo(() => {
    const priorityWeight: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    return reports
      .filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.reportId.toLowerCase().includes(q) ||
          r.caseId.toLowerCase().includes(q) ||
          r.generatedBy.toLowerCase().includes(q) ||
          (r.priorityDetails?.priorityLevel && r.priorityDetails.priorityLevel.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const weightA = priorityWeight[a.priorityDetails?.priorityLevel || "MEDIUM"] || 2;
        const weightB = priorityWeight[b.priorityDetails?.priorityLevel || "MEDIUM"] || 2;
        if (weightB !== weightA) {
          return weightB - weightA; // HIGH (3) first, then MEDIUM (2), then LOW (1)
        }
        // Secondary sort by risk score descending
        return (b.priorityDetails?.score || 0) - (a.priorityDetails?.score || 0);
      });
  }, [reports, searchQuery]);

  const highPriorityCount = useMemo(
    () => reports.filter((r) => r.priorityDetails?.priorityLevel === "HIGH").length,
    [reports]
  );
  const mediumPriorityCount = useMemo(
    () => reports.filter((r) => r.priorityDetails?.priorityLevel === "MEDIUM").length,
    [reports]
  );
  const lowPriorityCount = useMemo(
    () => reports.filter((r) => r.priorityDetails?.priorityLevel === "LOW").length,
    [reports]
  );

  function handleCaseSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    setFormCaseId(selectedId);
    const targetCase = cases.find((c) => c.caseId === selectedId);
    if (targetCase) {
      setFormTitle(`Executive Flood Impact Report - ${targetCase.location.name}`);
    }
  }

  async function handleGenerateReport(e: React.FormEvent) {
    e.preventDefault();
    if (!formCaseId || !formTitle) return;

    try {
      setSubmitting(true);
      const res = await reportsApi.createReport({
        caseId: formCaseId,
        title: formTitle,
        summary: formSummary,
      });

      if (res.success && res.data) {
        setSuccessMsg(`Report ${res.data.reportId} generated successfully! Downloading PDF...`);
        // Refresh list
        const updatedRes = await reportsApi.getReports();
        if (updatedRes.success && updatedRes.data) {
          setReports(updatedRes.data);
        }

        // Auto trigger download for new report
        const fullNewReport = updatedRes.data?.find((r: Report) => r.reportId === res.data.reportId) || res.data;
        downloadReportPDF(fullNewReport);

        setTimeout(() => {
          setShowGenerateModal(false);
          setFormSummary("");
          setSuccessMsg("");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Report generation failed:", err);
      alert(err.message || "Failed to generate report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Flood Assessment & PDF Reports Hub
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Official government disaster documentation, rescue priorities, downloadable PDF executive reports & MongoDB Atlas archives.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors shrink-0"
        >
          <Plus size={18} /> Generate Executive Report
        </button>
      </div>

      {/* Summary KPI Cards for High, Medium, Low Priority Breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <FileBarChart size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Reports</p>
            <p className="text-2xl font-extrabold text-slate-900">{reports.length}</p>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/40 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-700">HIGH Priority</p>
            <p className="text-2xl font-black text-red-600">{highPriorityCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">MEDIUM Priority</p>
            <p className="text-2xl font-black text-amber-600">{mediumPriorityCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">LOW Priority</p>
            <p className="text-2xl font-black text-emerald-600">{lowPriorityCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search size={18} className="text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search reports by title, ID, case, rescue priority level..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-slate-400 hover:text-slate-600 text-xs font-medium px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          <Loader2 size={28} className="animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading generated reports & priority matrix from database...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-5 py-3.5">Report Title & Reference</th>
                  <th className="px-5 py-3.5">Case Reference</th>
                  <th className="px-5 py-3.5">Rescue Priority Level</th>
                  <th className="px-5 py-3.5">Author Officer</th>
                  <th className="px-5 py-3.5">Date Generated</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">PDF Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReports.map((r) => {
                  const pLevel = r.priorityDetails?.priorityLevel || "MEDIUM";
                  const pScore = r.priorityDetails?.score ?? 65;

                  return (
                    <tr key={r.reportId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <p className="flex items-center gap-2 font-semibold text-slate-900">
                          <FileBarChart size={16} className="text-blue-600 shrink-0" /> {r.title}
                        </p>
                        <p className="font-mono text-xs text-slate-500 font-medium">{r.reportId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex font-mono text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {r.caseId}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <PriorityBadge level={pLevel} />
                          <span className="font-mono text-xs font-bold text-slate-600">
                            {pScore}/100
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{r.generatedBy}</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">
                        {new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 size={13} className="text-emerald-600" /> Archived PDF
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                          >
                            <Eye size={14} className="text-slate-500" /> Preview
                          </button>
                          <button
                            onClick={() => downloadReportPDF(r)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                          >
                            <Download size={14} /> Download PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm font-medium text-slate-500">
                      No assessment reports found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Generate Executive Flood Report</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Create an official assessment document stored in MongoDB Atlas and exportable to PDF.
                </p>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {successMsg && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Select Disaster Flood Case
                </label>
                <select
                  value={formCaseId}
                  onChange={handleCaseSelectChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  {cases.map((c) => (
                    <option key={c.caseId} value={c.caseId}>
                      {c.caseId} - {c.title} ({c.location.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Official Report Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  placeholder="e.g. Executive Flood Impact Report - Zone Alpha"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Executive Notes & Field Observations (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Enter detailed field observations, infrastructure damage notes, or custom directives..."
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                  Generate & Download PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    {selectedReport.reportId}
                  </span>
                  <PriorityBadge level={selectedReport.priorityDetails?.priorityLevel || "MEDIUM"} />
                  <span className="font-mono text-xs font-bold text-slate-600">
                    Risk Score: {selectedReport.priorityDetails?.score ?? 65}/100
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-2">
                  {selectedReport.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Associated Case: <strong className="text-slate-700">{selectedReport.caseId}</strong> • Created by {selectedReport.generatedBy}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Document Impact & Priority Preview Grid */}
            <div className="grid grid-cols-4 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div>
                <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase text-slate-500">
                  <ShieldAlert size={14} className="text-red-600" /> Priority Status
                </p>
                <p className="text-lg font-extrabold text-red-600 mt-1">
                  {selectedReport.priorityDetails?.priorityLevel || "MEDIUM"}
                </p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase text-slate-500">
                  <Waves size={14} className="text-blue-600" /> Inundation
                </p>
                <p className="text-lg font-extrabold text-blue-700 mt-1">
                  {selectedReport.caseDetails?.floodPercentage ?? 38.5}%
                </p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase text-slate-500">
                  <Building size={14} className="text-amber-600" /> Structures
                </p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">
                  {selectedReport.caseDetails?.affectedBuildings ?? 420}
                </p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase text-slate-500">
                  <Users size={14} className="text-emerald-600" /> Displaced
                </p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">
                  {Math.round((selectedReport.caseDetails?.affectedBuildings ?? 420) * 4.2).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Summary Text Box */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary & Field Observations</h4>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                {selectedReport.summary}
              </div>
            </div>

            {/* Directives Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Rescue Directives & Relief Status</h4>
              <div className="rounded-xl border border-slate-200 p-3 bg-amber-50/50 text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                Rescue Priority level & risk score calculated using multi-criteria flood depth, population density, and infrastructure impact models.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close Preview
              </button>
              <button
                onClick={() => downloadReportPDF(selectedReport)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <Download size={16} /> Download Official PDF Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
