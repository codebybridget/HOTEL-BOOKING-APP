import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import { protect } from "./middleware/authMiddleware.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

dotenv.config();

connectDB();
connectCloudinary();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-app-frontend-rxdr.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Clerk webhook must stay before express.json()
app.use(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

// Public routes
app.use("/api/user", userRouter);
app.use("/api/rooms", roomRouter);

// Protected routes
app.use("/api/hotels", protect, hotelRouter);
app.use("/api/bookings", protect, bookingRouter);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "Authenticated",
    userId: req.userId,
    user: req.user,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});