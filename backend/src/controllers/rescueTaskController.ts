import { Request, Response } from "express";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";
import {
  getRescueTasks,
  getRescueTaskById,
  getRescueTaskStatistics,
  TaskFilterOptions,
} from "../services/rescueTaskService";
import { TaskUrgency, TaskType, TaskStatus } from "../models/RescueTask";

/**
 * GET /api/v1/rescue-tasks
 * Retrieves generated operational rescue tasks with optional filtering
 */
export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const { sceneId, urgency, taskType, riskCategory, status, search, limit, page } = req.query;

  const filterOptions: TaskFilterOptions = {
    sceneId: sceneId ? String(sceneId) : undefined,
    urgency: urgency ? (String(urgency) as TaskUrgency) : undefined,
    taskType: taskType ? (String(taskType) as TaskType) : undefined,
    riskCategory: riskCategory ? String(riskCategory) : undefined,
    status: status ? (String(status) as TaskStatus) : undefined,
    search: search ? String(search) : undefined,
  };

  const tasks = getRescueTasks(filterOptions);

  // Optional pagination
  const pageNum = page ? parseInt(String(page), 10) : 1;
  const limitNum = limit ? parseInt(String(limit), 10) : tasks.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedTasks = tasks.slice(startIndex, startIndex + limitNum);

  return sendSuccess(
    res,
    `Retrieved ${tasks.length} rescue tasks successfully`,
    {
      total: tasks.length,
      page: pageNum,
      limit: limitNum,
      tasks: paginatedTasks,
    },
    200
  );
});

/**
 * GET /api/v1/rescue-tasks/stats
 * Retrieves distribution statistics across urgency, task type, risk categories
 */
export const getTaskStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = getRescueTaskStatistics();
  return sendSuccess(res, "Rescue task statistics retrieved successfully", stats, 200);
});

/**
 * GET /api/v1/rescue-tasks/:taskId
 * Retrieves an individual rescue task record
 */
export const getTaskDetails = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = getRescueTaskById(taskId);

  if (!task) {
    throw new AppError(`Rescue task with ID '${taskId}' not found`, 404);
  }

  return sendSuccess(res, `Rescue task '${taskId}' retrieved successfully`, task, 200);
});
