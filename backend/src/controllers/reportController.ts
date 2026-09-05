import { Request, Response } from "express";
import { Report } from "../models/Report";
import { FloodCase } from "../models/FloodCase";
import { Assessment } from "../models/Assessment";
import { RescuePriority } from "../models/RescuePriority";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";
import { logAudit } from "../services/auditService";

export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const { caseId, title, summary, fileUrl } = req.body;

  if (!caseId || !title) {
    throw new AppError("caseId and report title are required", 400);
  }

  const floodCase = await FloodCase.findOne({
    $or: [{ caseId }, { _id: caseId }],
  });

  if (!floodCase) {
    throw new AppError(`Flood case '${caseId}' not found`, 404);
  }

  const count = await Report.countDocuments();
  const reportId = `RPT-${100 + count + 1}`;

  const reportSummary =
    summary ||
    `Official Assessment Report for ${floodCase.title} (${floodCase.caseId}). Overall flood inundation: ${floodCase.floodPercentage}%. Total affected structures: ${floodCase.affectedBuildings}.`;

  const report = await Report.create({
    reportId,
    caseId: floodCase.caseId,
    title,
    summary: reportSummary,
    generatedBy: req.user?.name || "Response Officer",
    fileUrl: fileUrl || `/reports/download/${reportId}.pdf`,
  });

  await logAudit({
    user: req.user,
    action: "GENERATE_REPORT",
    resource: `/api/v1/reports/${reportId}`,
    details: { caseId: floodCase.caseId, reportId },
    ipAddress: req.ip,
  });

  return sendSuccess(res, "Assessment report generated successfully", report, 201);
});

export const getReports = asyncHandler(async (_req: Request, res: Response) => {
  // Check if any flood case exists in DB without a report document, and auto-create it
  const allCases = await FloodCase.find().lean();
  const existingReports = await Report.find().lean();
  const existingCaseIds = new Set(existingReports.map((r) => r.caseId));

  for (const c of allCases) {
    if (!existingCaseIds.has(c.caseId)) {
      const count = await Report.countDocuments();
      const reportId = `RPT-${100 + count + 1}`;
      await Report.create({
        reportId,
        caseId: c.caseId,
        title: `Executive Flood Impact Report - ${c.location?.name || c.title}`,
        summary: `Official Assessment Report for ${c.title} (${c.caseId}). Location: ${c.location?.name || "N/A"}. Description: ${c.description || "N/A"}`,
        generatedBy: c.createdBy || "Response Officer",
        fileUrl: `/reports/download/${reportId}.pdf`,
      });
    }
  }

  const reports = await Report.find().sort({ createdAt: -1 }).lean();
  
  // Attach case details and rescue priority info to each report
  const reportsWithCaseData = await Promise.all(
    reports.map(async (rpt) => {
      const floodCase = await FloodCase.findOne({ caseId: rpt.caseId }).lean();
      
      // Lookup matching assessment and priority level
      let priorityDetails = null;
      const assessment = await Assessment.findOne({ caseId: rpt.caseId }).lean();
      if (assessment) {
        const priorityDoc = await RescuePriority.findOne({ assessmentId: assessment.assessmentId }).lean();
        if (priorityDoc) {
          priorityDetails = {
            priorityLevel: priorityDoc.priorityLevel,
            score: Math.round(priorityDoc.score * 100),
            factors: priorityDoc.factors || [],
          };
        }
      }

      // Fallback priority calculation based on flood percentage if not explicitly assigned
      if (!priorityDetails && floodCase) {
        const pct = floodCase.floodPercentage || 0;
        const level = pct >= 50 ? "HIGH" : pct >= 30 ? "MEDIUM" : "LOW";
        priorityDetails = {
          priorityLevel: level,
          score: Math.round(pct * 1.25),
          factors: [
            { label: "Flood Inundation Level", weight: 0.4 },
            { label: "Population Risk Index", weight: 0.3 },
            { label: "Infrastructure Impact", weight: 0.3 },
          ],
        };
      }

      return {
        ...rpt,
        caseDetails: floodCase || null,
        priorityDetails: priorityDetails || { priorityLevel: "MEDIUM", score: 65, factors: [] },
      };
    })
  );

  return sendSuccess(res, "Assessment reports retrieved successfully", reportsWithCaseData, 200);
});

export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const report = await Report.findOne({
    $or: [{ reportId: id }, { _id: id }],
  }).lean();

  if (!report) {
    throw new AppError(`Report '${id}' not found`, 404);
  }

  const floodCase = await FloodCase.findOne({ caseId: report.caseId }).lean();
  const assessment = await Assessment.findOne({ caseId: report.caseId }).lean();
  let priorityDetails = null;
  if (assessment) {
    const priorityDoc = await RescuePriority.findOne({ assessmentId: assessment.assessmentId }).lean();
    if (priorityDoc) {
      priorityDetails = {
        priorityLevel: priorityDoc.priorityLevel,
        score: Math.round(priorityDoc.score * 100),
        factors: priorityDoc.factors || [],
      };
    }
  }

  return sendSuccess(res, "Report details retrieved", {
    ...report,
    caseDetails: floodCase || null,
    priorityDetails: priorityDetails || { priorityLevel: "MEDIUM", score: 65, factors: [] },
  }, 200);
});

