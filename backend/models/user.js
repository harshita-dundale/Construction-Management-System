import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true }, // Unique ID from Auth0
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true},
    role: { type: String, enum: ["builder", "worker"], default: "" },
    profileImage: { type: String, default: null }, // Profile image URL from Cloudinary
    phoneNo: { type: String, default: null }, // Phone number
    experience: { type: Number, default: null }, // Experience in years
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;