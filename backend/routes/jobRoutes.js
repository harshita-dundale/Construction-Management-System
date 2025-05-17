import express from "express";
import multer from "multer";
import path from "path";
import Job from "../models/job.js";

const router = express.Router();

// Set storage for multer
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

// Route to handle job post with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, salary, startDate, endDate, location, PhoneNo } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const newJob = new Job({
      title,
      salary,
      startDate,
      endDate,
      location,
      PhoneNo,
      image: imagePath,
    });

    await newJob.save();

    res.status(201).json({ message: "Job Posted Successfully", job: newJob });
  } catch (error) {
    console.error("❌ Error posting job:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

export default router;
