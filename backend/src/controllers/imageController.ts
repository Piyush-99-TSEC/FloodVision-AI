import { Request, Response } from "express";
import { Image } from "../models/Image";
import { FloodCase } from "../models/FloodCase";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  const { caseId, filename, originalName, mimeType, size, url } = req.body;

  if (!caseId || !url) {
    throw new AppError("caseId and image URL are required", 400);
  }

  const floodCase = await FloodCase.findOne({
    $or: [{ caseId }, { _id: caseId }],
  });

  if (!floodCase) {
    throw new AppError(`Flood case '${caseId}' does not exist`, 404);
  }

  const imageCount = await Image.countDocuments();
  const imageId = `IMG-${1000 + imageCount + 1}`;

  const image = await Image.create({
    imageId,
    caseId: floodCase.caseId,
    filename: filename || originalName || `image_${imageId}.jpg`,
    originalName: originalName || filename || `image_${imageId}.jpg`,
    mimeType: mimeType || "image/jpeg",
    size: size || 1024000,
    url,
    uploadedBy: req.user?.id || "System User",
  });

  return sendSuccess(res, "Image registered successfully", image, 201);
});

export const getImagesByCase = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;

  const images = await Image.find({ caseId }).sort({ createdAt: -1 });

  return sendSuccess(res, `Images for case '${caseId}' retrieved`, images, 200);
});
