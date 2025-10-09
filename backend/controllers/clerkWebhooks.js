import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // ✅ Ensure raw body exists
    if (!req.body || !(req.body instanceof Buffer)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook payload — raw body missing.",
      });
    }

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Svix requires the raw body as a UTF-8 string
    const payload = req.body.toString("utf8");

    // ✅ Required headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ Verify and parse
    const evt = await whook.verify(payload, headers);
    const { data, type } = evt;

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("🔴 Clerk webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
