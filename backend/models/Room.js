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
      minlength: 2,
      maxlength: 100,
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
      index: true,
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

// HOOKS
roomSchema.pre("save", function (next) {
  if (this.roomType) {
    this.roomType = this.roomType.trim();
  }

  this.amenities = this.amenities.map((item) => item.trim());

  next();
});

const Room = mongoose.model("Room", roomSchema);

export default Room;