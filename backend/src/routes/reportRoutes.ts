import { Router } from "express";
import { createReport, getReportById, getReports } from "../controllers/reportController";
import { authenticateUser } from "../middleware/auth";
import { authorizeRoles } from "../middleware/rbac";

const router = Router();

router.use(authenticateUser);

router.post("/", authorizeRoles("admin", "officer"), createReport);
router.get("/", authorizeRoles("admin", "officer", "analyst", "viewer"), getReports);
router.get("/:id", authorizeRoles("admin", "officer", "analyst", "viewer"), getReportById);

export default router;

