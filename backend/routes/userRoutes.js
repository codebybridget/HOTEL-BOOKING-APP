import express from "express";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserData,
  setUserRole,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", requireAuth(), protect, getUserData);

userRouter.post(
  "/set-role",
  requireAuth(),
  protect,
  setUserRole
);

export default userRouter;