import express from "express";
const router = express.Router();
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  getJobsByWorker,
  getAttendanceByWorkerAndJob,
  getAttendanceSummaryByEmail,
} from "../controllers/applyController.js";

// 🔹 All Routes
router.get("/", getApplications);
router.post("/", createApplication);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);
router.get("/my-jobs", getJobsByWorker);
router.get("/worker-attendance", getAttendanceByWorkerAndJob);
router.get("/summary", getAttendanceSummaryByEmail);
// router.get("/my-jobs/:userId", getJobsByWorker);

export default router;
