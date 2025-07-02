import express from "express";
import {
  saveWorkerRecords,
  getWorkerRecords
} from "../controllers/workerRecordController.js";

const router = express.Router();

router.post("/save", saveWorkerRecords);
router.get("/", getWorkerRecords);

export default router;