import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

dotenv.config();

connectDB();
connectCloudinary();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Clerk webhook must use raw body before express.json()
app.use(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.use(express.json());
app.use(clerkMiddleware());

// Public routes
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/user", userRouter);
app.use("/api/rooms", roomRouter);

// Protected routes
app.use("/api/hotels", requireAuth(), hotelRouter);
app.use("/api/bookings", requireAuth(), bookingRouter);

app.get("/api/protected", requireAuth(), (req, res) => {
  res.json({
    message: "Authenticated",
    userId: req.auth.userId,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});