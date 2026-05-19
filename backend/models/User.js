import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk User ID
    _id: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      trim: true,
      default: "Guest",
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
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

      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },

        message: "Recent searched cities limit exceeded",
      },
    },
  },
  {
    timestamps: true,
  }
);

// INDEXES
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// HOOKS
userSchema.pre("save", function (next) {
  // Default username
  if (!this.username || this.username.trim() === "") {
    this.username = "Guest";
  }

  // Remove duplicate cities
  if (this.recentSearchedCities?.length) {
    this.recentSearchedCities = [
      ...new Set(
        this.recentSearchedCities.map((city) =>
          city.trim().toLowerCase()
        )
      ),
    ];
  }

  next();
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;