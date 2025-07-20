import Application from "../models/application.js";
import Attendance from "../models/WorkerRecord.js";

import mongoose from "mongoose";
// 🔹 GET Applications
export const getApplications = async (req, res) => {
  const { workerEmail, status, experience, projectId } = req.query;
 // console.log("Requested workerEmail:", workerEmail);
  try {
    const filter = {};
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      // filter.projectId = projectId;
      filter.projectId = new mongoose.Types.ObjectId(projectId); 
    }    
    if (workerEmail) {
      filter.email = workerEmail;
    }
    if (status && status !== "all") {
      filter.status = new RegExp(`^${status}$`, "i");
    }
    // if (experience) {
    //   filter.experience = { $gte: experience };
    // }
    if (experience && experience !== "all" && !isNaN(experience)) {
      filter.experience = { $gte: parseFloat(experience) };
    }
    
   console.log("📥 Final Mongo Filter:", filter);
    const applications = await Application.find(filter).populate("jobId", "title salary").populate("userId", "_id name");
    console.log("📤 Applications found:", applications.length);

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// 🔹 POST New Application
export const createApplication = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phoneNo,
      experience,
      jobId,
      projectId,
      appliedAt,
      status,
    } = req.body;

    if (!name || !email || !jobId) {
      return res.status(400).json({ error: "Name, Email, and Job ID are required" });
    }
    const newApp = new Application({
      userId,
      name,
      email,
      phoneNo,
      experience,
      jobId,
      projectId,
      appliedAt: appliedAt || new Date(),
      status: status || "under_review",
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    console.error("❌ Error saving application:", err.message, err.stack);
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

// Get jobs applied by a worker (with job titles)
export const getJobsByWorker = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });
 // console.log("📥 Received Email:", req.query.email);

  try {
    // const applications = await Application.find({ email }).populate({
    //   path: "jobId",
    //   select: "title _id", 
    // });
    const applications = await Application.find({ email, status: "accepted" }).populate("jobId");

    const jobs = applications
      .map((app) => app.jobId)
      .filter((job) => job !== null);

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs for user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAttendanceByWorkerAndJob = async (req, res) => {
  const { workerId, jobId } = req.query;

  if (!workerId || !jobId) {
    return res.status(400).json({ error: "workerId and jobId are required" });
  }

  try {
    const records = await Attendance.find({ workerId, jobId });

    let totalPresent = 0;
    let totalAbsent = 0;

    const attendanceList = records.map((rec) => {
      if (rec.status === "Present") totalPresent++;
      else totalAbsent++;

      return {
        date: rec.date,
        status: rec.status,
      };
    });

    res.status(200).json({
      attendanceList,
      totalPresent,
      totalAbsent,
    });
  } catch (error) {
    console.error("Error fetching getAttendanceByWorkerAndJob attendance:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getAttendanceSummaryByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // Find all accepted applications by email and populate job info
    const applications = await Application.find({ email, status: "accepted" }).populate("jobId");

    let totalDays = 0;
    let absentDays = 0;

    for (const app of applications) {
      if (!app.jobId) continue; // skip if job deleted

      const attendanceRecords = await Attendance.find({
        workerId: app.workerId, // ✅ fixed here
        jobId: app.jobId._id,
      });

      attendanceRecords.forEach((rec) => {
        totalDays++;
        if (rec.status === "Absent") absentDays++;
      });
    }

    const presentDays = totalDays - absentDays;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      totalDays: presentDays,
      absentDays,
      percentage,
    });
  } catch (error) {
    console.error("Error in attendance summary:", error);
    res.status(500).json({ error: "Server error" });
  }
};


