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

// Public route (optional)
bookingRouter.post("/check-availability", checkAvailabilityAPI);

// Protected booking creation
bookingRouter.post("/book", requireAuth(), protect, createBooking);

// Fetch user's bookings
bookingRouter.get("/user", requireAuth(), protect, getUserBookings);

// Hotel owner bookings dashboard
bookingRouter.get("/hotel", requireAuth(), protect, getHotelBookings);

export default bookingRouter;
