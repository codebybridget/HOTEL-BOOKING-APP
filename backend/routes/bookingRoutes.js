import express from "express";

import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Check room availability
bookingRouter.post(
  "/check-availability",
  checkAvailabilityAPI
);

/* =========================
   PROTECTED ROUTES
========================= */

// Create booking
bookingRouter.post(
  "/",
  protect,
  createBooking
);

// Current user bookings
bookingRouter.get(
  "/my",
  protect,
  getUserBookings
);

// Hotel owner dashboard bookings
bookingRouter.get(
  "/hotel",
  protect,
  getHotelBookings
);

export default bookingRouter;