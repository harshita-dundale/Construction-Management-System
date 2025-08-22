import Project from "../models/project.js";

export const getProjectsByUserId = async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.userId);
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const projects = await Project.find({ userId });
    res.json({ projects });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};
export const addProject = async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "User ID and Project name required" });
    }

    const existing = await Project.findOne({ userId, name });
    if (existing) {
      return res.status(400).json({ error: "Project already exists" });
    }

    const newProject = new Project({
      userId,
      name,
      createdAt: new Date(),
    });

    await newProject.save();

    res.status(201).json({ message: "Project created", project: newProject });
  } catch (error) {
    console.error("🚨 Error in addProject:", error.message, error.stack);
    res.status(500).json({ error: "Failed to add project" });
  }
};

export const deleteProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const deleted = await Project.findByIdAndDelete(projectId);
    if (!deleted) return res.status(404).json({ message: "Project not found" });

    const remainingProjects = await Project.find({ userId: deleted.userId });
    res.status(200).json({ message: "Project deleted successfully", projects: remainingProjects });

  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

//Optional route for builder project check on refresh
// GET /api/projects/exists/:userId
export const checkIfProjectsExist = async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.userId);
    const exists = await Project.exists({ userId });
    return res.json({ exists: !!exists });
  } catch (error) {
    console.error("Error checking project existence:", error);
    res.status(500).json({ error: "Server error" });
  }
};