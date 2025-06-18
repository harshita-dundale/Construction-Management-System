import express from "express";
import Application from "../models/application.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { workerEmail } = req.query;
  console.log("Requested workerEmail:", workerEmail); 

  try {
    const filter = workerEmail ? { email: workerEmail } : {}; // if email is present, filter; else return all
    console.log("Mongo Filter:", filter); 

    const applications = await Application.find(filter).populate("jobId", "title");
    console.log("Fetched Applications:", applications);
    res.json(applications);

  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// 🔹 Get all applications  (ALTERNATE OPTION)
// router.get("/", async (req, res) => {
//   try {
//     const applications = await Application.find();
//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch applications" });
//   }
// });

// router.get("/worker", async (req, res) => {
//   const { email } = req.query;
//   try {
//     const applications = await Application.find({ email });
//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch worker applications" });
//   }
// });

// 🔹 Create a new application
router.post("/", async (req, res) => {
  try {
    console.log("📦 Received Application:", req.body); 
    const { name, email, phoneNo, experience, skills, jobId } = req.body;

    // Optional: Basic field validation
    if (!name || !email || !jobId) {
      return res.status(400).json({ error: "Name, Email, and Job ID are required" });
    }

    const newApp = new Application({
      name,
      email,
      phoneNo,
      experience,
      skills,
      jobId,
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(500).json({ error: "Failed to save application" });
  }
});
//or
// router.post("/", async (req, res) => {
//   try {
//     const newApp = new Application(req.body);
//     await newApp.save();
//     res.status(201).json(newApp);
//   } catch (err) {
//     console.error("Error saving application:", err);
//     res.status(500).json({ error: "Failed to save application" });
//   }
// });

// 🔹 Update application status (Accept/Reject)
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;