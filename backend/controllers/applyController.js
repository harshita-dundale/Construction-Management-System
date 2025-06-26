import Application from "../models/application.js";

// 🔹 GET Applications
export const getApplications = async (req, res) => {
  const { workerEmail, status, experience } = req.query;
 // console.log("Requested workerEmail:", workerEmail);
  try {
    const filter = {};
    if (workerEmail) {
      filter.email = workerEmail;
    }
    if (status && status !== "all") {
      filter.status = new RegExp(`^${status}$`, "i");
    }
    if (experience) {
      filter.experience = { $gte: experience };
    }

   // console.log("📥 Final Mongo Filter:", filter);
    const applications = await Application.find(filter).populate("jobId", "title salary");
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// 🔹 POST New Application
export const createApplication = async (req, res) => {
  try {
    const { name, email, phoneNo, experience, skills, jobId } = req.body;

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
};

// 🔹 PATCH Update Application Status
export const updateApplicationStatus = async (req, res) => {
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
};

// 🔴 DELETE Application
export const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
};
