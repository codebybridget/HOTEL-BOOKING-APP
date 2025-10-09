import { getAuth } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    console.log("🟣 Headers received:", req.headers.authorization);
    const { userId, sessionId, claims } = getAuth(req);
    console.log("🟢 Clerk userId:", userId);
    console.log("🟢 Clerk sessionId:", sessionId);
    console.log("🟢 Clerk claims:", claims);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID found. Please log in.",
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("🔴 Clerk Auth Middleware Error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed. Invalid or expired token.",
    });
  }
};
