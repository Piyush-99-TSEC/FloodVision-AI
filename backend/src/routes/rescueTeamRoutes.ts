import { Router } from "express";
import { getAllTeams, getTeamDetails } from "../controllers/rescueTeamController";

const router = Router();

router.get("/", getAllTeams);
router.get("/:teamId", getTeamDetails);

export default router;
