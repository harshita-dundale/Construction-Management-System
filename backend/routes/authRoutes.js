import express from "express";
import {
  setUserRole,
  getUserRole,
  getUserByEmail
} from "../controllers/authController.js";

const router = express.Router();

router.post("/set-role", setUserRole);
router.get("/get-role", getUserRole);
router.get("/api/get-user/:email", getUserByEmail);

export default router;
