import { Request, Response } from "express";
import { Assessment } from "../models/Assessment";
import { DamageResult } from "../models/DamageResult";
import { RescuePriority } from "../models/RescuePriority";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";

export const getAllRescuePriorities = asyncHandler(async (_req: Request, res: Response) => {
  const priorities = await RescuePriority.find().sort({ score: -1 });
  return sendSuccess(res, "All rescue priorities retrieved successfully", priorities, 200);
});

export const getResultByAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { assessmentId } = req.params;

  const assessment = await Assessment.findOne({
    $or: [{ assessmentId }, { _id: assessmentId }],
  });

  if (!assessment) {
    throw new AppError(`Assessment '${assessmentId}' not found`, 404);
  }

  const damageResult = await DamageResult.findOne({
    assessmentId: assessment.assessmentId,
  });

  const rescuePriorities = await RescuePriority.find({
    assessmentId: assessment.assessmentId,
  }).sort({ score: -1 });

  return sendSuccess(
    res,
    `AI analysis results for assessment '${assessment.assessmentId}' retrieved`,
    {
      assessment,
      damageResult,
      rescuePriorities,
    },
    200
  );
});

