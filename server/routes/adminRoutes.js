import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getBosses,
  promoteToBoss,
  demoteBoss,
  resetSystem,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/bosses", protect, authorize("admin"), getBosses);
router.post("/bosses", protect, authorize("admin"), promoteToBoss);
router.delete("/bosses/:id", protect, authorize("admin"), demoteBoss);
router.post("/reset-system", protect, authorize("admin"), resetSystem);

export default router;
