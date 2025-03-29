import express from "express";
import {
  getFinancialReport,
  manageManagers,
} from "../controllers/bossController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/financial-report", authenticate, isAdmin, getFinancialReport);
router.post("/manage-managers", authenticate, isAdmin, manageManagers);

export default router;
