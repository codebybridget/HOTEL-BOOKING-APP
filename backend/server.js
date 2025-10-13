import express from "express"
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware} from "@clerk/express"; 
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

// Routers
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";



connectDB()
connectCloudinary()

const app = express()
app.use(cors())


// Middlewares
app.use(express.json())
app.use(clerkMiddleware())


// API to listen to clerk Webhook )
app.use("/api/clerk", clerkWebhooks);


// ✅ Debug route to confirm Clerk auth works
app.get("/api/debug-auth", (req, res) => {
  const { userId, sessionId } = getAuth(req);
  res.json({
    message: "Clerk auth debug info",
    userId,
    sessionId,
    authHeader: req.headers.authorization,
  });
});

// ✅ Protected Routes
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);

// ✅ Error handling middleware (optional but useful)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});




app.get("/", (req, res) => res.send("API is working fine. "));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
