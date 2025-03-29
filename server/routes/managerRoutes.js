import express from "express";
import {
  approveRental,
  manageCars,
  getReturnedCars,
  lockUser,
} from "../controllers/managerController.js";
import { authenticate, isManager } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/approve-rental/:rentalId", authenticate, isManager, approveRental);
router.post("/manage-cars", authenticate, isManager, manageCars);
router.get("/returned-cars", authenticate, isManager, getReturnedCars);
router.put("/lock-user/:userId", authenticate, isManager, lockUser);

export default router;
