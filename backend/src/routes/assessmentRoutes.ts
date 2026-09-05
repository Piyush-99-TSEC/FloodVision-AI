import { Router } from "express";
import {
  createAssessment,
  getAssessmentById,
  getAssessmentsByCase,
} from "../controllers/assessmentController";
import { authenticateUser } from "../middleware/auth";
import { authorizeRoles } from "../middleware/rbac";

const router = Router();

router.use(authenticateUser);

router.post("/", authorizeRoles("admin", "officer", "analyst"), createAssessment);
router.get("/:id", authorizeRoles("admin", "officer", "analyst", "viewer"), getAssessmentById);
router.get("/case/:caseId", authorizeRoles("admin", "officer", "analyst", "viewer"), getAssessmentsByCase);

export default router;
