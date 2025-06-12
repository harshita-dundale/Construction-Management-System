
import express from "express";
import mongoose from "mongoose";
import WorkerRecord from "../models/WorkerRecord.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    await WorkerRecord.deleteMany({}); // purane records hatao

    const saved = await WorkerRecord.insertMany(req.body); // naye records daalo
    res.json({ message: "Saved", data: saved });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await WorkerRecord.find({});
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Fetch error" });
  }
});

export default router;
