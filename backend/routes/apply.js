// import express from "express";
// import Application from "../models/application.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const applications = await Application.find();
//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch applications" });
//   }
// });

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
// export default router;


// import express from "express";
// import Application from "../models/application.js";

// const router = express.Router();

// // Get all applications
// router.get("/", async (req, res) => {
//   try {
//     const applications = await Application.find();
//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch applications" });
//   }
// });

// // Create new application
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

// // Update application status
// router.patch("/:id/status", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body; // expected: 'accepted', 'rejected', or 'pending'

//   try {
//     const updatedApp = await Application.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!updatedApp) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     res.json(updatedApp);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update status" });
//   }
// });

// export default router;



// routes/apply.js
import express from "express";
import Application from "../models/application.js";

const router = express.Router();

// 🔹 Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// 🔹 Create a new application
router.post("/", async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(500).json({ error: "Failed to save application" });
  }
});

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
