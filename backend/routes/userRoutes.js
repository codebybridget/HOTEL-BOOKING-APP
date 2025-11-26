import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAuth } from "@clerk/express";
import {
  getUserData,
  storeRecentSearchedCities,
} from "../controllers/userController.js";

const userRouter = express.Router();

// get authenticated user's full profile
userRouter.get("/", requireAuth(), protect, getUserData);

// store recent city searches
userRouter.post(
  "/store-recent-search",
  requireAuth(),
  protect,
  storeRecentSearchedCities
);

export default userRouter;
