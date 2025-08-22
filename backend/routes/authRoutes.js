// import express from "express";
// import {
//   setUserRole,
//   getUserRole,
//   getUserByEmail,
//   uploadProfileImage  // ✅ Isko include karo
// } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/set-role", setUserRole);
// router.get("/get-role", getUserRole);
// router.get("/api/get-user/:email", getUserByEmail);
// router.put("/profile-image", uploadProfileImage);  // ✅ Ye ab theek se chalega

// export default router;
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
router.get("/get-user/:email", getUserByEmail); // 🔹 FIXED: Removed extra /api
router.put("/profile-image", uploadProfileImage); // 🔹 Profile image update

export default router;