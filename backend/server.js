import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";

// Routers
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const app = express();
connectDB();
connectCloudinary();

// 🟢 Webhook route (raw body)
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// 🟢 Middlewares (CORS, JSON, Clerk)
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// 🟢 Test route (optional, for debugging)
app.get("/api/debug-auth", (req, res) => {
  const { userId, sessionId } = getAuth(req);
  res.json({ userId, sessionId, authHeader: req.headers.authorization });
});

// 🟢 Actual API routes
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);

app.get("/", (req, res) => res.send("✅ API is working fine."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
