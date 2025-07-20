import express from "express";
import {
  setUserRole,
  getUserRole,
  getUserByEmail,
  uploadProfileImage
} from "../controllers/authController.js";

const router = express.Router();

// 🔹 User role routes
router.post("/set-role", setUserRole);
router.get("/get-role", getUserRole);

// 🔹 User profile routes
router.get("/get-user/:email", getUserByEmail); 
router.put("/profile-image", uploadProfileImage); 

export default router;
