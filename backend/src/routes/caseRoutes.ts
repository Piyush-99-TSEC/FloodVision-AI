import { Router } from "express";
import {
  createCase,
  getCases,
  getDashboardSummary,
  getCaseById,
  updateCase,
  deleteCase,
} from "../controllers/caseController";
import { authenticateUser } from "../middleware/auth";
import { authorizeRoles } from "../middleware/rbac";

const router = Router();

router.use(authenticateUser);

router.post("/", authorizeRoles("admin", "officer", "analyst"), createCase);
router.get("/", authorizeRoles("admin", "officer", "analyst", "viewer"), getCases);
router.get("/summary/stats", authorizeRoles("admin", "officer", "analyst", "viewer"), getDashboardSummary);
router.get("/:id", authorizeRoles("admin", "officer", "analyst", "viewer"), getCaseById);
router.patch("/:id", authorizeRoles("admin", "officer"), updateCase);
router.delete("/:id", authorizeRoles("admin"), deleteCase);

export default router;
