import express from "express";
// import {
//   saveWorkerRecords,
//   getWorkerRecords
// } from "../controllers/workerRecordController.js";   // DELETE THIS CONTROLLER  

import {
  markAttendance,
  markAllAttendance,
  getWorkerHistory,
} from "../controllers/attendanceController.js";

const router = express.Router();

// router.post("/save", saveWorkerRecords);
// router.get("/", getWorkerRecords);

router.post("/mark", markAttendance); // Single worker
router.post("/mark-all", markAllAttendance); // All workers
router.get("/history/:workerId", getWorkerHistory); // History


export default router;
