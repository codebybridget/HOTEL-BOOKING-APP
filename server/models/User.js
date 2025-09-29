import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk user ID
    username: { type: String, trim: true }, // optional, Clerk may not always provide
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String }, // optional profile image
    role: {
      type: String,
      enum: ["user", "hotelOwner", "admin"],
      default: "user",
    },
    recentSearchCities: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10, // keep it small for performance
        message: "Recent searches cannot exceed 10 cities.",
      },
    },
  },
  { timestamps: true }
);

// Prevent overwriting existing model when hot reloading in dev
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
