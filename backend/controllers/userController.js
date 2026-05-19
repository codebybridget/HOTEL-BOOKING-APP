import User from "../models/User.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const user = await User.findById(userId);

    res.json({
      success: true,
      role: user?.role || null,
      recentSearchedCities: user?.recentSearchedCities || [],
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          role,
        },
        $setOnInsert: {
          _id: userId,
          username: "Guest",
          email: `${userId}@clerk.local`,
          image: "",
          recentSearchedCities: [],
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      message: "Role updated",
      role: user.role,
    });
  } catch (error) {
    console.error("Set role error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};