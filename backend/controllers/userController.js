import User from "../models/User.js";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);

    res.json({
      success: true,
      role: user?.role || null, // ✅ IMPORTANT
      recentSearchedCities: user?.recentSearchedCities || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Set user role
export const setUserRole = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { role } = req.body;

    if (!["user", "hotelOwner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    await User.findByIdAndUpdate(userId, { role });

    res.json({ success: true, message: "Role updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};