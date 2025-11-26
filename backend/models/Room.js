import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    // FIXED: hotel should be ObjectId, not String
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomType: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: {
      type: [String], // Array of strings only
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster lookups
roomSchema.index({ hotel: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
