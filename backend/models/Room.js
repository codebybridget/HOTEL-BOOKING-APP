import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
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
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one image is required",
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ==========================
// INDEXES
// ==========================

// Fast lookup by hotel
roomSchema.index({ hotel: 1 });

// Availability + sorting optimization
roomSchema.index({ isAvailable: 1, createdAt: -1 });

// ==========================
// HOOKS (optional)
// ==========================
roomSchema.pre("save", function (next) {
  if (this.roomType) {
    this.roomType = this.roomType.trim();
  }
  next();
});

const Room = mongoose.model("Room", roomSchema);

export default Room;