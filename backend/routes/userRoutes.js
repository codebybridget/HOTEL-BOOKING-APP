import express from "express";

import {
  getUserData,
  setUserRole,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

/* =========================
   PROTECTED ROUTES
========================= */

// Get current user data
userRouter.get(
  "/",
  protect,
  getUserData
);

// Set user role
userRouter.post(
  "/set-role",
  protect,
  setUserRole
);

export default userRouter;