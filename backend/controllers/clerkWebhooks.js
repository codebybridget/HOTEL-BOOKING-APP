import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("❌ Missing CLERK_WEBHOOK_SECRET");
      return res.status(500).json({
        success: false,
        message: "Webhook secret missing",
      });
    }

    const rawBody = req.body.toString("utf8");

    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({
        success: false,
        message: "Missing Svix headers",
      });
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    const event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    const { type, data } = event;

    switch (type) {
      case "user.created":
      case "user.updated": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          username:
            [data.first_name, data.last_name].filter(Boolean).join(" ") ||
            data.username ||
            "",
          image: data.image_url || "",
        };

        await User.findByIdAndUpdate(data.id, userData, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        });

        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        console.log("Unhandled webhook type:", type);
        break;
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Webhook verification failed",
    });
  }
};

export default clerkWebhooks;