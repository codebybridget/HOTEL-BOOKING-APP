import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";

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

// Create room
roomRouter.post(
  "/",
  protect,
  upload.array("images", 4),
  createRoom
);

// Get hotel owner's rooms
roomRouter.get(
  "/owner",
  protect,
  getOwnerRooms
);

// Toggle room availability
roomRouter.patch(
  "/:id/availability",
  protect,
  toggleRoomAvailability
);

export default roomRouter;