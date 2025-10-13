import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, 
    username: { type: String, trim: true }, 
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    role: {type: String, enum: ["user", "hotelOwner"], default: "user", },
    recentSearchCities: [{type: String, required: true }],
  },{ timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
