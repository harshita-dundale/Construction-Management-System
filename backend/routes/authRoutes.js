import express from "express";
import {
  setUserRole,
  getUserRole,
  getUserByEmail,
  updateUserProfile,
  uploadProfileImage,
  deleteProfileImage
} from "../controllers/authController.js";

const router = express.Router();

// 🔹 User role routes
router.post("/set-role", setUserRole);
router.get("/get-role", getUserRole);

// 🔹 User profile routes
router.get("/get-user/:email", getUserByEmail); 
router.put("/update-profile", updateUserProfile); // New route for profile updates
router.put("/profile-image", uploadProfileImage);
router.delete("/profile-image", deleteProfileImage); 

export default router;