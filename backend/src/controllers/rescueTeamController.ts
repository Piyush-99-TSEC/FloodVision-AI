import { Request, Response } from "express";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";
import {
  getRescueTeams,
  getRescueTeamById,
  getTeamAssignments,
  getTeamAssignmentById,
  generateTeamAssignments,
  getAllocationStatistics,
} from "../services/rescueTeamService";
import { TeamType, TeamStatus } from "../models/RescueTeam";
import { AssignmentStatus } from "../models/TeamAssignment";

/**
 * GET /api/v1/rescue-teams
 * Retrieves list of simulated rescue teams with optional filters
 */
export const getAllTeams = asyncHandler(async (req: Request, res: Response) => {
  const { teamType, status, available, search } = req.query;

  const filters = {
    teamType: teamType ? (String(teamType) as TeamType) : undefined,
    status: status ? (String(status) as TeamStatus) : undefined,
    available: available !== undefined ? available === "true" : undefined,
    search: search ? String(search) : undefined,
  };

  const teams = getRescueTeams(filters);

  return sendSuccess(
    res,
    `Retrieved ${teams.length} rescue teams successfully`,
    {
      total: teams.length,
      teams,
    },
    200
  );
});

/**
 * GET /api/v1/rescue-teams/:teamId
 * Retrieves an individual rescue team
 */
export const getTeamDetails = asyncHandler(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const team = getRescueTeamById(teamId);

  if (!team) {
    throw new AppError(`Rescue team with ID '${teamId}' not found`, 404);
  }

  return sendSuccess(res, `Rescue team '${teamId}' retrieved successfully`, team, 200);
});

/**
 * GET /api/v1/assignments
 * Retrieves generated team assignments with optional filters
 */
export const getAllAssignments = asyncHandler(async (req: Request, res: Response) => {
  const { teamId, taskId, status, urgency, search } = req.query;

  const filters = {
    teamId: teamId ? String(teamId) : undefined,
    taskId: taskId ? String(taskId) : undefined,
    status: status ? (String(status) as AssignmentStatus) : undefined,
    urgency: urgency ? String(urgency) : undefined,
    search: search ? String(search) : undefined,
  };

  const assignments = getTeamAssignments(filters);

  return sendSuccess(
    res,
    `Retrieved ${assignments.length} team assignments successfully`,
    {
      total: assignments.length,
      assignments,
    },
    200
  );
});

/**
 * POST /api/v1/assignments/generate
 * Generates explainable optimal team assignments from pending rescue tasks
 */
export const triggerAssignmentGeneration = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = generateTeamAssignments();

    return sendSuccess(
      res,
      `Generated ${result.assignedCount} team assignments across ${result.totalConsidered} tasks successfully`,
      result,
      201
    );
  }
);

/**
 * GET /api/v1/assignments/stats
 * Retrieves allocation metrics and breakdown
 */
export const getAssignmentStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = getAllocationStatistics();
  return sendSuccess(res, "Allocation statistics retrieved successfully", stats, 200);
});

/**
 * GET /api/v1/assignments/:assignmentId
 * Retrieves single assignment details
 */
export const getAssignmentDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { assignmentId } = req.params;
    const assignment = getTeamAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError(`Team assignment '${assignmentId}' not found`, 404);
    }

    return sendSuccess(
      res,
      `Team assignment '${assignmentId}' retrieved successfully`,
      assignment,
      200
    );
  }
);
