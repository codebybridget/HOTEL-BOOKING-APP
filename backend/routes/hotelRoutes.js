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

/* =========================
   OWNER ROUTES
========================= */

// GET OWNER HOTELS
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

/* =========================
   SINGLE HOTEL ROUTE
========================= */

// IMPORTANT:
// KEEP THIS LAST
// so "owner/me" does not clash with ":id"

hotelRouter.get("/:id", getHotelById);

export default hotelRouter;