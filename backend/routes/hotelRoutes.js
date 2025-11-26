import express from "express";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const router = express.Router();

// Only authenticated users & with full MongoDB user loaded
router.post("/", requireAuth(), protect, registerHotel);

export default router;
