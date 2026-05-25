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
   PUBLIC ROUTES
========================= */

// GET ALL HOTELS
hotelRouter.get("/", getHotels);

// GET SINGLE HOTEL
hotelRouter.get("/:id", getHotelById);

/* =========================
   PROTECTED OWNER ROUTES
========================= */

// GET ALL OWNER HOTELS
hotelRouter.get(
  "/owner/me",
  protect,
  getOwnerHotel
);

// REGISTER NEW HOTEL
hotelRouter.post(
  "/",
  protect,
  upload.single("image"),
  registerHotel
);

// UPDATE SPECIFIC HOTEL
hotelRouter.patch(
  "/owner/:hotelId",
  protect,
  upload.single("image"),
  updateOwnerHotel
);

export default hotelRouter;