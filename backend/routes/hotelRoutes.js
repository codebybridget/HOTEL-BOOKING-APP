import express from "express";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

/* =========================
   PROTECTED ROUTES
========================= */

// Register hotel (one per user)
hotelRouter.post("/", requireAuth(), protect, registerHotel);

export default hotelRouter;