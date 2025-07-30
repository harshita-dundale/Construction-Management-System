import express from "express";
const router = express.Router();

import {
  getJobsByWorker,
  getAttendanceByWorkerAndJob,
  getAttendanceSummaryByEmail,
} from "../controllers/applyController.js"; 

import { getWorkerAttendanceSummary} from "../controllers/attendanceController.js";

router.get("/my-jobs", getJobsByWorker);
router.get("/worker-attendance", getAttendanceByWorkerAndJob);
router.get("/summary", getAttendanceSummaryByEmail);
router.get("/worker-summary", getWorkerAttendanceSummary);


export default router;
