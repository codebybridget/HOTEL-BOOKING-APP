import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware, getAuth } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const app = express();

connectDB();
connectCloudinary();

app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/api/debug-auth", (req, res) => {
  const { userId, sessionId } = getAuth(req);
  res.json({ userId, sessionId, authHeader: req.headers.authorization });
});

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);

app.get("/", (req, res) => res.send("API running 🚀"));

app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err.stack || err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
