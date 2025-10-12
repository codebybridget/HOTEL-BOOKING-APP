import User from "../models/User.js";

/**
 * @desc Get user data
 * @route GET /api/user
 * @access Private
 */
export const getUserData = async (req, res) => {
  try {
    const userId = req.user?.sub; // Clerk JWT stores user ID in "sub"

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      role: user.role || "user",
      recentSearchedCities: user.recentSearchedCities || [],
    });
  } catch (error) {
    console.error("❌ getUserData error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Store recently searched city
 * @route POST /api/user/recent-search
 * @access Private
 */
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!recentSearchedCity) {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    // Limit recent search list to 3
    if (user.recentSearchedCities.length >= 3) {
      user.recentSearchedCities.shift();
    }
    user.recentSearchedCities.push(recentSearchedCity);

    await user.save();

    res.json({ success: true, message: "City added", recentSearchedCities: user.recentSearchedCities });
  } catch (error) {
    console.error("❌ storeRecentSearchedCities error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
