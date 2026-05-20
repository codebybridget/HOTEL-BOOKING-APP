import express from "express";

import {
  registerHotel,
  getOwnerHotel,
} from "../controllers/hotelController.js";

const hotelRouter = express.Router();

/* =========================
   HOTEL ROUTES
========================= */

// Register hotel
hotelRouter.post("/", registerHotel);

// Get current owner's hotel
hotelRouter.get("/owner", getOwnerHotel);

export default hotelRouter;