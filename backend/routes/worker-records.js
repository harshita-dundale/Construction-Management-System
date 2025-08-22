import express from "express";

import {
  markAttendance,
  markAllAttendance,
  getWorkerHistory,
  getFullAttendanceHistoryByEmail
} from "../controllers/attendanceController.js";
const router = express.Router();

router.post("/mark", markAttendance); // Single worker
router.post("/mark-all", markAllAttendance); // All workers
router.get("/history/:workerId", getWorkerHistory); // History
router.get("/full-history", getFullAttendanceHistoryByEmail);

export default router;