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

// Connect services
connectDB();
connectCloudinary();

const app = express();

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-app-frontend-rxdr.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* =========================
   WEBHOOKS
========================= */

// Clerk webhook must use RAW body
app.use(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(clerkMiddleware());

/* =========================
   ROUTES
========================= */

// Health check
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
app.use("/api/hotels", requireAuth(), hotelRouter);

app.use("/api/bookings", requireAuth(), bookingRouter);

// Protected test route
app.get("/api/protected", requireAuth(), (req, res) => {
  res.json({
    success: true,
    message: "Authenticated",
    userId: req.auth.userId,
  });
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});