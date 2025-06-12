import Project from "../models/project.js"; 
import express from "express";
const router = express.Router();

// const Project = require("../models/Project"); 

router.get("/:userId", async (req, res) => {
  console.log("📩 Fetch request received for user:", req.params.userId);  
  try {
    const userId = decodeURIComponent(req.params.userId); 
    console.log("🔍 Decoded userId:", userId);
    
    if (!userId) {
      console.log("❌ No userId received in params!");
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("🔍 Checking database for user ID:", userId);
    let userProjects = await Project.findOne({ userId });
    console.log("🔍 User projects found:", userProjects);

    if (!userProjects || !userProjects.projects || userProjects.projects.length === 0) {
      console.log("⚠️ No projects found for this user, sending empty array.");
      return res.status(200).json({ projects: [] }); // ✅ Return empty array instead of 404
    }

    console.log("✅ User projects found:", userProjects.projects);
    res.json({ projects: userProjects.projects  });
    
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Add new project
router.post("/", async (req, res) => { 
  console.log("📥 Request Body:", req.body);
  console.log("📩 Received POST request at /api/projects"); 

  try {
    const { userId, name } = req.body;
    console.log("📤 Extracted Data:", { userId, name });  
    if (!userId || !name) {
      console.error("Missing userId or name!");
      return res.status(400).json({ error: "User ID and project name required" });
    }

    let userProjects = await Project.findOne({ userId });
    console.log("Existing user projects:", userProjects);

    if (!userProjects) {
      userProjects = new Project({ userId, projects: [{ name, createdAt: new Date() }] 
      });
        } else {
      userProjects.projects.push({ name, createdAt: new Date() });
    }

    await userProjects.save();
    console.log("✅ Project saved successfully!");
    res.status(201).json({ message: "Project added", projects: userProjects.projects });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Failed to add project" });
  }
});

// DELETE a project by ID     

router.delete("/:id", async (req, res) => {
  const projectId = req.params.id;
  try {
    console.log("🧨 DELETE request received for ID:", req.params.id);
    const updatedDoc = await Project.findOneAndUpdate(
      { "projects._id": projectId },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully", data: updatedDoc });
  } catch (err) {
    console.error("❌ Error during delete:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
});

export default router;