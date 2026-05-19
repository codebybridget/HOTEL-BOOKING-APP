import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again.",
      });
    }

    let user = await User.findById(clerkId);

    if (!user) {
      user = await User.create({
        _id: clerkId,
        username: "Guest",
        email: `${clerkId}@clerk.local`,
        image: "",
        role: "user",
        recentSearchedCities: [],
      });
    }

    req.user = user;
    req.userId = clerkId;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};