import { Router } from "express";
import {
  getAllAssignments,
  getAssignmentStats,
  triggerAssignmentGeneration,
  getAssignmentDetails,
} from "../controllers/rescueTeamController";

const router = Router();

router.get("/stats", getAssignmentStats);
router.post("/generate", triggerAssignmentGeneration);
router.get("/", getAllAssignments);
router.get("/:assignmentId", getAssignmentDetails);

export default router;
