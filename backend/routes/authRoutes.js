import express from "express";
import {
  setUserRole,
  getUserRole,
  getUserByEmail,
  uploadProfileImage,
  deleteProfileImage
} from "../controllers/authController.js";

const router = express.Router();

// 🔹 User role routes
router.post("/set-role", setUserRole);
router.get("/get-role", getUserRole);

// 🔹 User profile routes
router.get("/get-user/:email", getUserByEmail); 
router.put("/profile-image", uploadProfileImage);
router.delete("/profile-image", deleteProfileImage); 

export default router;
