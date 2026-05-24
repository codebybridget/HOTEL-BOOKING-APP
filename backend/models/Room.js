import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomType: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    roomSize: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
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
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "At least one image is required",
      },
      required: true,
    },

    maxGuests: {
      type: Number,
      default: 2,
      min: 1,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// INDEXES
roomSchema.index({ hotel: 1 });
roomSchema.index({ isAvailable: 1, createdAt: -1 });
roomSchema.index({ hotel: 1, isAvailable: 1 });
roomSchema.index({ roomType: "text", description: "text" });
roomSchema.index({ pricePerNight: 1 });
roomSchema.index({ maxGuests: 1 });

// HOOKS
roomSchema.pre("save", function (next) {
  if (this.roomType) {
    this.roomType = this.roomType.trim();
  }

  if (this.roomSize) {
    this.roomSize = this.roomSize.trim();
  }

  if (this.description) {
    this.description = this.description.trim();
  }

  if (Array.isArray(this.amenities)) {
    this.amenities = this.amenities
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  next();
});

const Room =
  mongoose.models.Room ||
  mongoose.model("Room", roomSchema);

export default Room;