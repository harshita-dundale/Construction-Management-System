import Job from "../models/job.js";
import path from "path";

// 🔹 POST a New Job
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
      userId,
    } = req.body;

    //const userId = req.user?.sub || req.body.userId; 

    // ✅ ProjectId validation
    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ error: "projectId is required" });
    }

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
      userId,// ✅ projectId saved
    });

    await newJob.save();

    res.status(201).json({
      message: "Job Posted Successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// 🔹 GET All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs", message: error.message });
  }
};

// 🔹 POST a New Job
// export const postJob = async (req, res) => {
//   try {
//     const { title, salary, startDate, endDate, location, Email, PhoneNo, projectId } = req.body;

//     if (!projectId) {
//       return res.status(400).json({ error: "projectId is required" });
//     }
//     const imagePath = req.file ? req.file.filename : null;
      
//     const newJob = new Job({
//       title,
//       salary,
//       startDate,
//       endDate,
//       location,
//       Email,
//       PhoneNo,
//       image: imagePath,
//       projectId,
//     });

//     await newJob.save();

//     res.status(201).json({ message: "Job Posted Successfully", job: newJob });
//   } catch (error) {
//     console.error("Error posting job:", error);
//     res.status(500).json({ error: "Internal Server Error", message: error.message });
//   }
// };