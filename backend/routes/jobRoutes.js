
import express from "express";
import multer from "multer";
import path from "path";
import Job from "../models/job.js";
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, salary, startDate, endDate, location, Email, PhoneNo } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const newJob = new Job({
      title,
      salary,
      startDate,
      endDate,
      location,
      Email,
      PhoneNo,
      image: imagePath,
    });

    await newJob.save();

    res.status(201).json({ message: "Job Posted Successfully", job: newJob });
  } catch (error) {
    console.error(" Error posting job:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }); 
    res.status(200).json(jobs);
  } catch (error) {
    console.error(" Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs", message: error.message });
  }
});

export default router;