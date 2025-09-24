import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk user ID
    username: { type: String }, // not always guaranteed
    email: { type: String, required: true, unique: true },
    image: { type: String }, // not always guaranteed
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    recentSearchCities: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
