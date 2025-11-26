import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // 1. Raw body (Buffer) → string
    const rawBody = req.body.toString("utf8");

    // 2. Validate headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    if (!headers["svix-id"]) {
      return res.status(400).json({ success: false, message: "Missing svix headers" });
    }

    // 3. Verify signature
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const event = wh.verify(rawBody, headers);

    // 4. Extract verified data
    const { type, data } = event;

    const userData = {
      _id: data.id,  // must match your User schema type (String or ObjectId?)
      email: data.email_addresses?.[0]?.email_address || "",
      username: [data.first_name, data.last_name].filter(Boolean).join(" "),
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { upsert: true });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        break;
    }

    return res.status(200).json({ success: true, message: "Webhook received" });

  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
