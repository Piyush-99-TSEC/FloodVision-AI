import { Router } from "express";
import {
  getAllTasks,
  getTaskStats,
  getTaskDetails,
} from "../controllers/rescueTaskController";

const router = Router();

// Endpoint for statistics & aggregate analytics
router.get("/stats", getTaskStats);

// Main tasks retrieval endpoint with query filters
router.get("/", getAllTasks);

// Single task details endpoint
router.get("/:taskId", getTaskDetails);

export default router;
