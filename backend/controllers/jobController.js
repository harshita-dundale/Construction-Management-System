import Job from "../models/job.js";
import Project from "../models/project.js";
export const postJob = async (req, res) => {
  try {
    const {
      title,
      salary,
      startDate,
      endDate,
      location,
      Email,
      PhoneNo,
      projectId,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const userId = project.userId;
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
      projectId,
      userId,
    });

    await newJob.save();

    res.status(201).json({
      message: "Job Posted Successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("🚨 Error posting job:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// 🔹 GET /api/jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs", message: error.message });
  }
};

// 🔹 GET Builder's Posted Jobs (Project-wise)
export const getBuilderJobsByProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const jobs = await Job.find({ userId })
      .populate('projectId', 'name description location')
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ 
        message: "No jobs found for this builder",
        jobs: []
      });
    }

    const jobsByProject = {};
    
    jobs.forEach(job => {
      const projectId = job.projectId._id.toString();
      const projectName = job.projectId.name;
      
      if (!jobsByProject[projectId]) {
        jobsByProject[projectId] = {
          projectId: projectId,
          projectName: projectName,
          projectDetails: job.projectId,
          jobs: []
        };
      }
      
      jobsByProject[projectId].jobs.push({
        _id: job._id,
        title: job.title,
        salary: job.salary,
        startDate: job.startDate,
        endDate: job.endDate,
        location: job.location,
        Email: job.Email,
        PhoneNo: job.PhoneNo,
        image: job.image,
        createdAt: job.createdAt
      });
    });

    const result = Object.values(jobsByProject);

    res.status(200).json({
      message: "Builder jobs fetched successfully",
      totalJobs: jobs.length,
      totalProjects: result.length,
      data: result
    });

  } catch (error) {
    console.error("🚨 Error fetching builder jobs:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// 🔹 GET Jobs for a specific project
export const getJobsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const jobs = await Job.find({ projectId })
      .populate('projectId', 'name description location')
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ 
        message: "No jobs found for this project",
        jobs: []
      });
    }

    res.status(200).json({
      message: "Project jobs fetched successfully",
      totalJobs: jobs.length,
      projectDetails: jobs[0].projectId,
      jobs: jobs
    });

  } catch (error) {
    console.error("🚨 Error fetching project jobs:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      salary,
      startDate,
      endDate,
      location,
      Email,
      PhoneNo,
      projectId
    } = req.body;

    const updateFields = {
      title,
      salary,
      startDate,
      endDate,
      location,
      Email,
      PhoneNo,
      projectId,
    };

    if (req.files && req.files.image) {
      updateFields.image = req.files.image[0].filename;
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("🚨 Error updating job:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully", job: deletedJob });
  } catch (error) {
    console.error("🚨 Error deleting job:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
