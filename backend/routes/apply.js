import express from "express";
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applyController.js";

const router = express.Router();

// 🔹 All Routes
router.get("/", getApplications);
router.post("/", createApplication);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);

export default router;