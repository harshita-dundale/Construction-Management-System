import Application from "../models/application.js";
import Attendance from "../models/WorkerRecord.js";

import mongoose from "mongoose";
// 🔹 GET Applications
export const getApplications = async (req, res) => {
  const { workerEmail, status, experience, projectId } = req.query;
 // console.log("Requested workerEmail:", workerEmail);
  try {
    const filter = { 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }; // Show non-deleted applications
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
    
  // console.log("📥 Final Mongo Filter:", filter);
    const applications = await Application.find(filter).populate("jobId", "title salary").populate("userId", "_id name");
 //   console.log("📤 Applications found:", applications.length);

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

// 🔴 SOFT DELETE Application
export const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    // First check if application exists
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update with soft delete fields
    const deleted = await Application.findByIdAndUpdate(
      id,
      { 
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true, upsert: false }
    );
    
    console.log("Application soft deleted:", deleted._id);
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
    const applications = await Application.find({ 
      email, 
      status: "accepted", 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }).populate("jobId");

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

// 💰 PAYROLL Calculation
export const calculatePayroll = async (req, res) => {
  const { email, month, year } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const applications = await Application.find({ 
      email, 
      status: "accepted", 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }).populate("jobId");

    let payrollData = [];
    let totalEarnings = 0;

    for (const app of applications) {
      if (!app.jobId) continue;

      let dateFilter = { workerId: app._id, projectId: app.projectId };
      
      // Add month/year filter if provided
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        dateFilter.date = { $gte: startDate, $lte: endDate };
      }

      const attendanceRecords = await Attendance.find(dateFilter);
      
      const dailySalary = app.jobId.salary / 30;
      let jobEarnings = 0;
      let presentDays = 0;

      attendanceRecords.forEach((rec) => {
        if (rec.status === "Present") {
          presentDays++;
          jobEarnings += dailySalary;
        }
      });

      if (presentDays > 0) {
        payrollData.push({
          jobTitle: app.jobId.title,
          dailySalary: Math.round(dailySalary),
          presentDays,
          jobEarnings: Math.round(jobEarnings)
        });
        totalEarnings += jobEarnings;
      }
    }

    res.status(200).json({
      payrollData,
      totalEarnings: Math.round(totalEarnings),
      month: month || "All",
      year: year || "All"
    });
  } catch (error) {
    console.error("Error calculating payroll:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔍 DEBUG Function - Check attendance data
// 📋 GET All Attendance Records
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate('workerId', 'name email')
      .populate('projectId', 'title')
      .sort({ date: -1 });
    
    res.json({
      total: attendanceRecords.length,
      records: attendanceRecords
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const debugAttendance = async (req, res) => {
  const { email } = req.query;
  
  try {
    const applications = await Application.find({ 
      email, 
      status: "accepted", 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }).populate("jobId");

    console.log(`📧 Email: ${email}`);
    console.log(`📋 Applications found: ${applications.length}`);
    
    for (const app of applications) {
      console.log(`\n🔹 Application ID: ${app._id}`);
      console.log(`🔹 Project ID: ${app.projectId}`);
      console.log(`🔹 Job: ${app.jobId?.title}`);
      
      const attendanceRecords = await Attendance.find({
        workerId: app._id,
        projectId: app.projectId
      });
      
      console.log(`📊 Attendance records: ${attendanceRecords.length}`);
      attendanceRecords.forEach(rec => {
        console.log(`   📅 ${rec.date.toDateString()} - ${rec.status}`);
      });
    }
    
    res.json({ message: "Check console for debug info" });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: "Debug failed" });
  }
};

export const getAttendanceSummaryByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // Find all accepted applications by email and populate job info
    const applications = await Application.find({ 
      email, 
      status: "accepted", 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }).populate("jobId");

    let totalDays = 0;
    let absentDays = 0;
    let totalEarnings = 0;

    for (const app of applications) {
      if (!app.jobId) continue; // skip if job deleted

      const attendanceRecords = await Attendance.find({
        workerId: app._id,
        projectId: app.projectId
      });

      const dailySalary = app.jobId.salary / 30; // Monthly salary / 30 days
      
      attendanceRecords.forEach((rec) => {
        totalDays++;
        if (rec.status === "Absent") {
          absentDays++;
        } else if (rec.status === "Present") {
          totalEarnings += dailySalary;
        }
      });
    }

    const presentDays = totalDays - absentDays;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      totalDays: presentDays,
      absentDays,
      percentage,
      totalEarnings: Math.round(totalEarnings)
    });
  } catch (error) {
    console.error("Error in attendance summary:", error);
    res.status(500).json({ error: "Server error" });
  }
};