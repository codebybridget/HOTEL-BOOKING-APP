import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Svix requires raw body as a string
    const payload = req.body.toString("utf8");

    // Required headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify event
      await  whook.verify(JSON.stringify(req.body), headers)

    const { data, type } = req.body

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name+ " "  +data.last_name,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":{
        await User.create(userData);
        break;
      }
      case "user.updated":{
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted":{
        await User.findOneAndDelete( data.id );
        break;
      }

      default:
         break;
    }

    res.json({ success: true, message: "Webhook Received" })

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
