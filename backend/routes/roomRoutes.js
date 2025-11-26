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

// Create room (Owner only)
roomRouter.post(
  "/",
  requireAuth(),
  protect,
  upload.array("images", 4),
  createRoom
);

// Get all available rooms (Public)
roomRouter.get("/", getRooms);

// Get rooms belonging to hotel owner
roomRouter.get("/owner", requireAuth(), protect, getOwnerRooms);

// Toggle availability (Owner only)
roomRouter.post(
  "/toggle-availability",
  requireAuth(),
  protect,
  toggleRoomAvailability
);

export default roomRouter;
