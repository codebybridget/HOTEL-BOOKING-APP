import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    // MUST be String only if your User model uses String _id
    owner: {
      type: String,
      required: true,
      unique: true, // Prevent multiple hotels per owner
      ref: "User",
    },

    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Normalize city names
    },
  },
  { timestamps: true }
);

// Add indexes to speed up lookups
hotelSchema.index({ owner: 1 });
hotelSchema.index({ city: 1 });

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
