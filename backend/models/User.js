import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk user ID
    _id: { type: String, required: true },

    username: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    image: { type: String },

    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },

    // FIXED: must match controllers and frontend
    recentSearchedCities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
