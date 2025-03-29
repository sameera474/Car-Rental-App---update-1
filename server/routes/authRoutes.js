import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// ✅ User & Company Staff Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post("/company-login", login); // ✅ Company Staff Login Route

export default router;
