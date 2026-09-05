import { Router } from "express";
import { getResultByAssessment, getAllRescuePriorities } from "../controllers/resultController";
import { authenticateUser } from "../middleware/auth";
import { authorizeRoles } from "../middleware/rbac";

const router = Router();

router.use(authenticateUser);

router.get("/priorities/all", authorizeRoles("admin", "officer", "analyst", "viewer"), getAllRescuePriorities);
router.get("/:assessmentId", authorizeRoles("admin", "officer", "analyst", "viewer"), getResultByAssessment);

export default router;

