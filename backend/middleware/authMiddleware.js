import { getAuth } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    // ✅ Ensure Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Bearer token.",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token not found in header.",
      });
    }

    // ✅ Verify token using Clerk’s built-in method
    const { userId, sessionId, claims } = getAuth(req);

    console.log("🔑 Clerk Auth Debug Info:");
    console.log("→ userId:", userId);
    console.log("→ sessionId:", sessionId);
    console.log("→ claims:", claims);

    // ✅ Reject if no userId found (invalid/expired token)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token. Please log in again.",
      });
    }

    // ✅ Attach user info to request for downstream controllers
    req.userId = userId;
    req.userEmail = claims?.email;
    req.userFirstName = claims?.first_name;
    req.userLastName = claims?.last_name;
    req.userImage = claims?.image_url;

    // ✅ Continue request flow
    next();
  } catch (error) {
    console.error("❌ Clerk Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed: Invalid or expired token.",
    });
  }
};
