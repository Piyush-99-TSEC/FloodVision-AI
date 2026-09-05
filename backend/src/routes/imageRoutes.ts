import { Router } from "express";
import { uploadImage, getImagesByCase } from "../controllers/imageController";
import { authenticateUser } from "../middleware/auth";
import { authorizeRoles } from "../middleware/rbac";

const router = Router();

router.use(authenticateUser);

router.post("/", authorizeRoles("admin", "officer", "analyst"), uploadImage);
router.get("/case/:caseId", authorizeRoles("admin", "officer", "analyst", "viewer"), getImagesByCase);

export default router;
