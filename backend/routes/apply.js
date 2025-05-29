// backend/routes/apply.js
import express from "express";
import Application from "../models/application.js";

const router = express.Router();

// POST /api/apply
router.post("/", async (req, res) => {
  try {
    const { name, email, experience, skills, jobId } = req.body;

    const application = new Application({
      name,
      email,
      experience,
      skills,
      jobId,
    });

    await application.save();
    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    console.error("❌ Error applying:", error);
    res.status(500).json({ message: "Failed to apply", error: error.message });
  }
});

export default router;