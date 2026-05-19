import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL;

    // Validate env
    if (!mongoURL) {
      console.error("❌ MONGODB_URL is missing in .env");
      process.exit(1);
    }

    // Connect
    const conn = await mongoose.connect(mongoURL);

    console.log(`🔥 MongoDB Connected: ${conn.connection.host}`);

    // Connection Events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB Reconnected");
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;