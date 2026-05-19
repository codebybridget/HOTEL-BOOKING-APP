import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
    } = process.env;

    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary environment variables are missing");
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    console.log("☁️ Cloudinary connected successfully");
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    process.exit(1);
  }
};

export default connectCloudinary;
export { cloudinary };