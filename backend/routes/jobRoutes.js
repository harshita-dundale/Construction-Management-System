
import express from "express";
import Job from "../models/job.js";
import { protect, isBuilder } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isBuilder, async (req, res) => {
  try {
    const { title, salary, startDate, endDate, location, PhoneNo } = req.body;

    const newJob = new Job({ 
      title, salary, startDate, endDate, location, PhoneNo,
      builderId: req.user.id,
      
    });

    await newJob.save();
    res.status(201).json({ message: "Job Posted Successfully", job: newJob });
    
  } catch (error) {
    console.error("❌ Error posting job:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

export default router;
