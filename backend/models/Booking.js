import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: String, // Clerk userId
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      lowercase: true,
    },

    paymentMethod: {
      type: String,
      default: "pay_at_hotel",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ==========================
// INDEXES (Performance)
// ==========================
bookingSchema.index({ room: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

// ==========================
// VALIDATION
// ==========================
bookingSchema.pre("save", function (next) {
  if (this.checkOutDate <= this.checkInDate) {
    return next(new Error("Check-out date must be after check-in date"));
  }
  next();
});

// ==========================
// VIRTUAL (Optional)
// ==========================
bookingSchema.virtual("nights").get(function () {
  const diff = this.checkOutDate - this.checkInDate;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;