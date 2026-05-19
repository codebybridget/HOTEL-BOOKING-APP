import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      req.user = null;
      return next();
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