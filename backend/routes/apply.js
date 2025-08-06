import express from "express";
const router = express.Router();
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  getJobsByWorker,
} from "../controllers/applyController.js";

router.get("/", getApplications);
router.post("/", createApplication);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);
router.get("/my-jobs", getJobsByWorker);

export default router;
