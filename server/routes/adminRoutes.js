import express from "express";
import { addStaff } from "../controllers/adminController.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Only Admin or Boss can add staff
router.post(
  "/add-staff",
  authenticateUser,
  authorizeRole(["admin", "boss"]),
  addStaff
);

export default router;
