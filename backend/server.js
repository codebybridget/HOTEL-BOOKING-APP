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

// 🔐 CORS (dev + production)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// 🔥 Clerk Webhooks MUST use raw body
app.use(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// 📦 Normal JSON body parser AFTER webhook
app.use(express.json());

// 🔐 Clerk Auth middleware
app.use(clerkMiddleware());

// 📌 Protected routes (apply requireAuth if needed)
app.use("/api/user", userRouter);
app.use("/api/hotels", requireAuth(), hotelRouter);
app.use("/api/room", requireAuth(), roomRouter);
app.use("/api/bookings", requireAuth(), bookingRouter);

// Test route
app.get("/api/protected", requireAuth(), (req, res) => {
  res.json({
    message: "You are authenticated!",
    userId: req.auth.userId,
  });
});

// ❌ 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❗ Global error handler (recommended)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
