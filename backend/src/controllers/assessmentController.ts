import { Request, Response } from "express";
import { Assessment } from "../models/Assessment";
import { FloodCase } from "../models/FloodCase";
import { runAiAssessment } from "../services/aiService";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";
import { logAudit } from "../services/auditService";

export const createAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { caseId, imageId, modelVersion } = req.body;

  if (!caseId || !imageId) {
    throw new AppError("caseId and imageId are required", 400);
  }

  const floodCase = await FloodCase.findOne({
    $or: [{ caseId }, { _id: caseId }],
  });

  if (!floodCase) {
    throw new AppError(`Flood case '${caseId}' not found`, 404);
  }

  const count = await Assessment.countDocuments();
  const assessmentId = `A-${2280 + count + 1}`;

  const assessment = await Assessment.create({
    assessmentId,
    caseId: floodCase.caseId,
    imageId,
    status: "completed",
    modelVersion: modelVersion || "v1.0.0",
    completedAt: new Date(),
  });

  // Isolated AI microservice execution (mocked for now, will call Python FastAPI service in future)
  const { damageResult, rescuePriority } = await runAiAssessment({
    assessmentId,
    caseId: floodCase.caseId,
    imageId,
  });

  // Update case metrics with latest assessment results
  floodCase.floodPercentage = damageResult.floodPercentage;
  floodCase.affectedBuildings = damageResult.affectedBuildings;
  floodCase.status = "assessing";
  await floodCase.save();

  await logAudit({
    user: req.user,
    action: "CREATE_ASSESSMENT",
    resource: `/api/v1/assessments/${assessmentId}`,
    details: { caseId: floodCase.caseId, assessmentId },
    ipAddress: req.ip,
  });

  return sendSuccess(
    res,
    "Assessment created and AI analysis completed",
    { assessment, damageResult, rescuePriority },
    201
  );
});

export const getAssessmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const assessment = await Assessment.findOne({
    $or: [{ assessmentId: id }, { _id: id }],
  });

  if (!assessment) {
    throw new AppError(`Assessment '${id}' not found`, 404);
  }

  return sendSuccess(res, "Assessment details retrieved", assessment, 200);
});

export const getAssessmentsByCase = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;

  const assessments = await Assessment.find({ caseId }).sort({ createdAt: -1 });

  return sendSuccess(res, `Assessments for case '${caseId}' retrieved`, assessments, 200);
});
