import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const bookingRouter = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Check availability
bookingRouter.post("/check-availability", checkAvailabilityAPI);

/* =========================
   PROTECTED ROUTES
========================= */

// Create booking
bookingRouter.post("/", requireAuth(), protect, createBooking);

// Get current user's bookings
bookingRouter.get("/my", requireAuth(), protect, getUserBookings);

// Hotel owner dashboard bookings
bookingRouter.get("/hotel", requireAuth(), protect, getHotelBookings);

export default bookingRouter;