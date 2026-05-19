import User from "../models/User.js";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      role: user.role || null,
      recentSearchedCities: user.recentSearchedCities || [],
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Set user role
export const setUserRole = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { role } = req.body;

    if (!["user", "hotelOwner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Role updated",
      role: user.role,
    });
  } catch (error) {
    console.error("Set role error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};