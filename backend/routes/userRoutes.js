import express from "express";
import { requireAuth } from "@clerk/express";

import {
  getUserData,
  setUserRole,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", requireAuth(), getUserData);

userRouter.post("/set-role", requireAuth(), setUserRole);

export default userRouter;