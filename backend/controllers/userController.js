import User from "../models/User.js";

// GET USER DATA
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).lean();

    return res.json({
      success: true,
      user: {
        role: user?.role || "user",
        recentSearchedCities: user?.recentSearchedCities || [],
      },
    });
  } catch (error) {
    console.error("Get user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};

// SET USER ROLE
export const setUserRole = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { role } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowedRoles = ["user", "hotelOwner"];

    if (!allowedRoles.includes(role)) {
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
        runValidators: true,
      }
    );

    return res.json({
      success: true,
      message: "Role updated successfully",
      role: user.role,
    });
  } catch (error) {
    console.error("Set role error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update role",
    });
  }
};