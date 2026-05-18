import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    // Clerk already ensures auth, but keep safety
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch user (lightweight)
    const user = await User.findById(userId).select(
      "_id role email username"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error in auth middleware",
    });
  }
};