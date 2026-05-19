import User from "../models/User.js";

// GET USER DATA
export const getUserData = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findOne({ clerkId }).lean();

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
    const clerkId = req.auth?.userId;
    const { role } = req.body;

    if (!clerkId) {
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

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: { role },
        $setOnInsert: {
          clerkId,
          username: "Guest",
          email: `${clerkId}@clerk.local`,
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