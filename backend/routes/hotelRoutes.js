import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  registerHotel,
  getOwnerHotel,
  updateOwnerHotel,
} from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post(
  "/",
  upload.single("image"),
  registerHotel
);

hotelRouter.get(
  "/owner",
  getOwnerHotel
);

hotelRouter.patch(
  "/owner",
  upload.single("image"),
  updateOwnerHotel
);

export default hotelRouter;