import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true }, // Unique ID from Auth0
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    role: { type: String, enum: ["builder", "worker"], default: " " }, // Add roles for builders and workers
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;