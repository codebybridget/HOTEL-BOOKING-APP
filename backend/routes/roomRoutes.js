import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAuth } from "@clerk/express";

import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Get all available rooms
roomRouter.get("/", getRooms);

/* =========================
   PROTECTED ROUTES
========================= */

// Create room (hotel owner)
roomRouter.post(
  "/",
  requireAuth(),
  protect,
  upload.array("images", 4),
  createRoom
);

// Get owner's rooms
roomRouter.get("/owner", requireAuth(), protect, getOwnerRooms);

// Toggle availability (RESTful)
roomRouter.patch(
  "/:id/availability",
  requireAuth(),
  protect,
  toggleRoomAvailability
);

export default roomRouter;