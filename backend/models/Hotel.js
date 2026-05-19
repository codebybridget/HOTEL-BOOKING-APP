import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },

    // Clerk User ID
    owner: {
      type: String,
      required: true,
      ref: "User",
      unique: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 2000,
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// INDEXES
hotelSchema.index({ city: 1 });
hotelSchema.index({ owner: 1 });
hotelSchema.index({ name: "text", city: "text" });

const Hotel =
  mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);

export default Hotel;