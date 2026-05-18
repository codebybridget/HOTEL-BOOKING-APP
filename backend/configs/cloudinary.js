import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;

  // Validate env variables
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error("❌ Cloudinary config missing:");
    console.error({
      CLOUDINARY_CLOUD_NAME: !!CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!CLOUDINARY_API_SECRET,
    });

    throw new Error("Cloudinary environment variables are not set properly");
  }

  // Configure
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  console.log("☁️  Cloudinary connected successfully");
};

export default connectCloudinary;
export { cloudinary };