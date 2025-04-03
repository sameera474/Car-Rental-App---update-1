// File: server/routes/bossRoutes.js
import express from "express";
import {
  getFinancialReport,
  manageManagers,
} from "../controllers/bossController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/financial-report",
  protect,
  authorize("boss", "admin"),
  getFinancialReport
);

router.post("/manage-managers", protect, authorize("boss"), manageManagers);

export default router;
