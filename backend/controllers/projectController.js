import Project from "../models/project.js";

// 🔹 Get Projects by User ID
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

// 🔹 Add New Project
export const addProject = async (req, res) => {
  try {
    const { userId, name, type, location, clientName, phoneNumber, email, startDate, expectedEndDate, expectedCost } = req.body;

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
      type: type || "",
      location: location || "",
      clientName: clientName || "",
      phoneNumber: phoneNumber || "",
      email: email || "",
      startDate: startDate || null,
      expectedEndDate: expectedEndDate || null,
      expectedCost: expectedCost || "",
      createdAt: new Date(),
    });

    await newProject.save();
    const allProjects = await Project.find({ userId });

    res.status(201).json({ message: "Project created", projects: allProjects });
  } catch (error) {
    console.error("🚨 Error in addProject:", error.message, error.stack);
    res.status(500).json({ error: "Failed to add project" });
  }
};


// 🔹 Update Project
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, type, location, clientName, phoneNumber, email, startDate, expectedEndDate, expectedCost } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { 
        name,
        type: type || "",
        location: location || "",
        clientName: clientName || "",
        phoneNumber: phoneNumber || "",
        email: email || "",
        startDate: startDate || null,
        expectedEndDate: expectedEndDate || null,
        expectedCost: expectedCost || ""
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error("❌ Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

// 🔹 Delete Project by ID
export const deleteProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    // const updatedDoc = await Project.findOneAndUpdate(
    //   { "projects._id": projectId },
    //   { $pull: { projects: { _id: projectId } } },
    //   { new: true }
    // );
    // if (!updatedDoc) {
    //   return res.status(404).json({ message: "Project not found" });
    // }
    // res.status(200).json({
    //   message: "Project deleted successfully",
    //   data: updatedDoc,
    // });
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

// or 
// export const checkIfProjectsExist = async (req, res) => {
//   try {
//     const userId = decodeURIComponent(req.params.userId);
//     const projectDoc = await Project.findOne({ userId });
//     if (!projectDoc || !projectDoc.projects || projectDoc.projects.length === 0) {
//       return res.json({ exists: false });
//     }
//     return res.json({ exists: true });
//   } catch (error) {
//     console.error("Error checking project existence:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// 🔹 Add New Project
// export const addProject = async (req, res) => {
//   try {
//     const { userId, name } = req.body;

//     if (!userId || !name) {
//       return res.status(400).json({ error: "User ID and project name required" });
//     }
//     let userProjects = await Project.findOne({ userId });
//     if (!userProjects) {
//       userProjects = new Project({
//         userId,
//         projects: [{ name, createdAt: new Date() }],
//       });
//     } else {
//       userProjects.projects.push({ name, createdAt: new Date() });
//     }
//     await userProjects.save();
//     res.status(201).json({ message: "Project added", projects: userProjects.projects });
//   } catch (error) {
//     console.error("Error adding project:", error);
//     res.status(500).json({ error: "Failed to add project" });
//   }
// };

// 🔹 Get Projects by User ID
// export const getProjectsByUserId = async (req, res) => {
//   try {
//     const userId = decodeURIComponent(req.params.userId);
//     console.log("👉 Getting projects for userId:", userId); 
//     if (!userProjects || !userProjects.projects || userProjects.projects.length === 0) {
//       console.log("No projects found for:", userId);
//       return res.status(200).json({ projects: [] }); // Return empty array
//     }
//     res.json({ projects: userProjects.projects });
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     res.status(500).json({ error: "Failed to fetch projects" });
//   }
// };