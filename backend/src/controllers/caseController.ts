import { Request, Response } from "express";
import { FloodCase } from "../models/FloodCase";
import { Assessment } from "../models/Assessment";
import { DamageResult } from "../models/DamageResult";
import { RescuePriority } from "../models/RescuePriority";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";
import { logAudit } from "../services/auditService";

import { Report } from "../models/Report";

export const createCase = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, location, eventDate } = req.body;

  if (!title || !description || !location || !location.name || location.latitude === undefined || location.longitude === undefined) {
    throw new AppError("Title, description, location (name, latitude, longitude) are required", 400);
  }

  // Generate unique case ID e.g. FC-1043
  const count = await FloodCase.countDocuments();
  const caseId = `FC-${1040 + count + 1}`;

  const floodCase = await FloodCase.create({
    caseId,
    title,
    description,
    location,
    eventDate: eventDate ? new Date(eventDate) : new Date(),
    createdBy: req.user?.name || "System Officer",
  });

  // Auto-generate initial executive report in MongoDB for newly created case
  const reportCount = await Report.countDocuments();
  const reportId = `RPT-${100 + reportCount + 1}`;
  await Report.create({
    reportId,
    caseId: floodCase.caseId,
    title: `Executive Flood Assessment Report - ${floodCase.location.name}`,
    summary: `Initial official disaster report for ${floodCase.title} (${floodCase.caseId}). Location: ${floodCase.location.name}. Event Description: ${floodCase.description}`,
    generatedBy: floodCase.createdBy || "System Officer",
    fileUrl: `/reports/download/${reportId}.pdf`,
  });

  await logAudit({
    user: req.user,
    action: "CREATE_CASE",
    resource: `/api/v1/cases/${caseId}`,
    details: { title, caseId },
    ipAddress: req.ip,
  });

  return sendSuccess(res, "Flood case created successfully", floodCase, 201);
});

export const getCases = asyncHandler(async (_req: Request, res: Response) => {
  const cases = await FloodCase.find().sort({ eventDate: -1, caseId: -1 });
  return sendSuccess(res, "Flood cases retrieved successfully", cases, 200);
});

export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const cases = await FloodCase.find().sort({ eventDate: -1, caseId: -1 });

  const activeCases = cases.filter((c) => c.status === "active" || c.status === "assessing").length;
  const completedAssessments = await Assessment.countDocuments({ status: "completed" });
  const totalAffectedBuildings = cases.reduce((sum, c) => sum + (c.affectedBuildings || 0), 0);
  const highPriorityZones = await RescuePriority.countDocuments({ priorityLevel: "HIGH" });

  const damageResults = await DamageResult.find();
  const damageDistributionMap = { noDamage: 0, minor: 0, major: 0, destroyed: 0 };
  damageResults.forEach((dr) => {
    if (dr.damageClasses) {
      damageDistributionMap.noDamage += dr.damageClasses.noDamage || 0;
      damageDistributionMap.minor += dr.damageClasses.minor || 0;
      damageDistributionMap.major += dr.damageClasses.major || 0;
      damageDistributionMap.destroyed += dr.damageClasses.destroyed || 0;
    }
  });

  const damageDistribution = [
    { class: "No Damage", count: damageDistributionMap.noDamage },
    { class: "Minor", count: damageDistributionMap.minor },
    { class: "Major", count: damageDistributionMap.major },
    { class: "Destroyed", count: damageDistributionMap.destroyed },
  ];

  const activeCase = cases.find((c) => c.status === "active" || c.status === "assessing") || cases[0];
  const targetPct = activeCase ? activeCase.floodPercentage : 62;

  const floodTrend = [
    { day: "Day 1", floodPercentage: Math.max(10, Math.round(targetPct * 0.35)) },
    { day: "Day 2", floodPercentage: Math.max(12, Math.round(targetPct * 0.45)) },
    { day: "Day 3", floodPercentage: Math.max(15, Math.round(targetPct * 0.58)) },
    { day: "Day 4", floodPercentage: Math.max(20, Math.round(targetPct * 0.78)) },
    { day: "Day 5", floodPercentage: Math.max(25, Math.round(targetPct * 0.92)) },
    { day: "Day 6", floodPercentage: Math.max(22, Math.round(targetPct * 0.86)) },
    { day: "Day 7", floodPercentage: Math.max(28, Math.round(targetPct * 0.98)) },
    { day: "Day 8", floodPercentage: Math.round(targetPct) },
  ];

  const firstPct = floodTrend[0].floodPercentage;
  const lastPct = floodTrend[floodTrend.length - 1].floodPercentage;
  const surgeVal = ((lastPct - firstPct) / (firstPct || 1)) * 100;
  const surgeText = `${surgeVal >= 0 ? "+" : ""}${surgeVal.toFixed(1)}% surge`;

  const trendCaseInfo = {
    caseId: activeCase ? activeCase.caseId : "FC-1050",
    title: activeCase ? activeCase.title : "Active Monitored Riverbank",
    surgeText,
  };

  return sendSuccess(res, "Dashboard summary statistics retrieved", {
    stats: {
      activeCases,
      completedAssessments,
      totalAffectedBuildings,
      highPriorityZones,
    },
    damageDistribution,
    floodTrend,
    trendCaseInfo,
    recentCases: cases.slice(0, 5),
  }, 200);
});


export const getCaseById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const floodCase = await FloodCase.findOne({
    $or: [{ caseId: id }, { _id: id }],
  });

  if (!floodCase) {
    throw new AppError(`Flood case '${id}' not found`, 404);
  }

  return sendSuccess(res, "Flood case details retrieved", floodCase, 200);
});

export const updateCase = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const floodCase = await FloodCase.findOneAndUpdate(
    { $or: [{ caseId: id }, { _id: id }] },
    updates,
    { new: true, runValidators: true }
  );

  if (!floodCase) {
    throw new AppError(`Flood case '${id}' not found`, 404);
  }

  await logAudit({
    user: req.user,
    action: "UPDATE_CASE",
    resource: `/api/v1/cases/${id}`,
    details: updates,
    ipAddress: req.ip,
  });

  return sendSuccess(res, "Flood case updated successfully", floodCase, 200);
});

export const deleteCase = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const floodCase = await FloodCase.findOneAndDelete({
    $or: [{ caseId: id }, { _id: id }],
  });

  if (!floodCase) {
    throw new AppError(`Flood case '${id}' not found`, 404);
  }

  await logAudit({
    user: req.user,
    action: "DELETE_CASE",
    resource: `/api/v1/cases/${id}`,
    details: { caseId: floodCase.caseId },
    ipAddress: req.ip,
  });

  return sendSuccess(res, "Flood case deleted successfully", { caseId: floodCase.caseId }, 200);
});
