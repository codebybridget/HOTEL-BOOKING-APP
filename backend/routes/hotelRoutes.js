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

// GET OWNER HOTEL
hotelRouter.get(
  "/owner/me",
  protect,
  getOwnerHotel
);

// REGISTER HOTEL
hotelRouter.post(
  "/",
  protect,
  upload.single("image"),
  registerHotel
);

// UPDATE OWNER HOTEL
hotelRouter.patch(
  "/owner/me",
  protect,
  upload.single("image"),
  updateOwnerHotel
);

export default hotelRouter;