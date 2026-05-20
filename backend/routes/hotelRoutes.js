import express from "express";

import {
  registerHotel,
  getOwnerHotel,
  updateOwnerHotel,
} from "../controllers/hotelController.js";

const hotelRouter = express.Router();

/* =========================
   HOTEL ROUTES
========================= */

// Register hotel
hotelRouter.post("/", registerHotel);

// Get current owner's hotel
hotelRouter.get("/owner", getOwnerHotel);

// Update hotel details
hotelRouter.patch("/owner", updateOwnerHotel);

export default hotelRouter;