import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  registerHotel,
  getHotels,
  getHotelById,
  getOwnerHotel,
  updateOwnerHotel,
} from "../controllers/hotelController.js";

const hotelRouter = express.Router();

/* =========================
   HOTEL ROUTES
========================= */

// GET ALL HOTELS
hotelRouter.get(
  "/",
  getHotels
);

// GET OWNER HOTEL
hotelRouter.get(
  "/owner",
  getOwnerHotel
);

// GET SINGLE HOTEL
hotelRouter.get(
  "/:id",
  getHotelById
);

// REGISTER HOTEL
hotelRouter.post(
  "/",
  upload.single("image"),
  registerHotel
);

// UPDATE OWNER HOTEL
hotelRouter.patch(
  "/owner",
  upload.single("image"),
  updateOwnerHotel
);

export default hotelRouter;