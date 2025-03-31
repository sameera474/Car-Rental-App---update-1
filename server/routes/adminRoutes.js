// File: server/routes/adminRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getFinancialReport,
  manageManagers,
  resetSystem,
  manageBosses,
} from "../controllers/adminController.js";

const router = express.Router();

// Financial Report
router.get(
  "/financial-report",
  protect,
  authorize("admin", "boss"),
  getFinancialReport
);

// Manager Management
router.post("/manage-managers", protect, authorize("boss"), manageManagers);

// Boss Management
router.post("/bosses", protect, authorize("admin"), manageBosses);

// System Reset
router.post("/reset-system", protect, authorize("admin"), resetSystem);

export default router;
