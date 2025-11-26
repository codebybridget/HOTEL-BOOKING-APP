import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  // Validate environment variables
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("❌ Missing Cloudinary environment variables");
  }

  // Config Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("☁️  Cloudinary connected");
};

export default connectCloudinary;
