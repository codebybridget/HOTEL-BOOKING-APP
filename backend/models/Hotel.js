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
      minlength: 7,
      maxlength: 20,
    },

    // Clerk user ID (string)
    owner: {
      type: String,
      required: true,
      ref: "User",
      index: true, // faster lookup
    },

    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Optional (future scaling)
    description: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// ==========================
// INDEXES
// ==========================
hotelSchema.index({ city: 1 });
hotelSchema.index({ owner: 1 });

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;