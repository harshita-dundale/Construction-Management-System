import Project from "../models/project.js";

// 🔹 Get Projects by User ID
export const getProjectsByUserId = async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userProjects = await Project.findOne({ userId });

    if (!userProjects || !userProjects.projects || userProjects.projects.length === 0) {
      return res.status(200).json({ projects: [] }); // Return empty array
    }

    res.json({ projects: userProjects.projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// 🔹 Add New Project
export const addProject = async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "User ID and project name required" });
    }

    let userProjects = await Project.findOne({ userId });

    if (!userProjects) {
      userProjects = new Project({
        userId,
        projects: [{ name, createdAt: new Date() }],
      });
    } else {
      userProjects.projects.push({ name, createdAt: new Date() });
    }

    await userProjects.save();
    res.status(201).json({ message: "Project added", projects: userProjects.projects });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ error: "Failed to add project" });
  }
};

// 🔹 Delete Project by ID
export const deleteProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const updatedDoc = await Project.findOneAndUpdate(
      { "projects._id": projectId },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      data: updatedDoc,
    });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};
