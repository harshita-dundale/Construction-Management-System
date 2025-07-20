// routes/attendanceRoutes.js
import express from "express";
const router = express.Router();

import {
  getJobsByWorker,
  getAttendanceByWorkerAndJob,
  getAttendanceSummaryByEmail,
} from "../controllers/applyController.js"; // or change to attendanceController if needed

router.get("/my-jobs", getJobsByWorker);
router.get("/worker-attendance", getAttendanceByWorkerAndJob);
router.get("/summary", getAttendanceSummaryByEmail);

export default router;
