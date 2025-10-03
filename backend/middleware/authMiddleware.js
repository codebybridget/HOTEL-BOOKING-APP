import { verifyToken } from "@clerk/backend";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload || !payload.sub) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    let user = await User.findOne({ clerkId: payload.sub });

    if (!user) {
      // auto-create user if not in DB
      user = await User.create({
        clerkId: payload.sub,
        email: payload.emailAddresses?.[0]?.emailAddress || "",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Protect middleware error:", error.message);
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};
