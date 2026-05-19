import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find user by Clerk ID
    let user = await User.findById(clerkId);

    // Auto-create user if missing
    if (!user) {
      user = await User.create({
        _id: clerkId,
        email: "temp@example.com",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};