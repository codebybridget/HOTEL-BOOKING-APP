import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk user ID
    _id: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      trim: true,
      default: "Guest",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
      index: true,
    },

    recentSearchedCities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// ==========================
// INDEXES
// ==========================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// ==========================
// HOOKS
// ==========================
userSchema.pre("save", function (next) {
  if (!this.username || this.username.trim() === "") {
    this.username = "Guest";
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;