import User from "../models/User.js";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      role: user.role || "guest",
      recentSearchedCities: user.recentSearchedCities || [],
    });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Store recently searched cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const userId = req.auth.userId;

    if (!recentSearchedCity || typeof recentSearchedCity !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid city name",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.recentSearchedCities) {
      user.recentSearchedCities = [];
    }

    // Maintain max 3 recent cities
    if (user.recentSearchedCities.length >= 3) {
      user.recentSearchedCities.shift();
    }

    user.recentSearchedCities.push(recentSearchedCity);
    await user.save();

    res.json({ success: true, message: "City added" });
  } catch (error) {
    console.error("storeRecentSearchedCities error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
