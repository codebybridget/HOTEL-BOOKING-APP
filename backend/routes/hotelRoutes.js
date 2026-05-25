import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

import {
  registerHotel,
  getHotels,
  getHotelById,
  getOwnerHotel,
  updateOwnerHotel,
} from "../controllers/hotelController.js";

const hotelRouter = express.Router();

/* =========================
   OWNER ROUTES FIRST
========================= */

// GET OWNER HOTELS
hotelRouter.get(
  "/owner/me",
  protect,
  getOwnerHotel
);

// UPDATE OWNER HOTEL
hotelRouter.patch(
  "/owner/:hotelId",
  protect,
  upload.single("image"),
  updateOwnerHotel
);

// REGISTER HOTEL
hotelRouter.post(
  "/",
  protect,
  upload.single("image"),
  registerHotel
);

/* =========================
   PUBLIC ROUTES
========================= */

// GET ALL HOTELS
hotelRouter.get("/", getHotels);

// IMPORTANT:
// THIS MUST ALWAYS BE LAST
hotelRouter.get("/:id", getHotelById);

export default hotelRouter;