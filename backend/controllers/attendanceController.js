
import Attendance from "../models/WorkerRecord.js";
import Application from "../models/application.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import application from "../models/application.js";
// Create or update attendance for one worker

export const markAttendance = async (req, res) => {
  try {
    const { workerId, date, status, projectId } = req.body;

    if (!workerId || !date || !status || !projectId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const selectedDate = new Date(new Date(date).toDateString());
    const today = new Date(new Date().toDateString());

    if (selectedDate > today) {
      return res
        .status(400)
        .json({ error: "Cannot mark attendance for future date" });
    }

    let attendance = await Attendance.findOne({
      workerId: new mongoose.Types.ObjectId(workerId),
      date: selectedDate,
      projectId,
    });

    if (attendance) {
      attendance.status = status;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        workerId: new mongoose.Types.ObjectId(workerId),
        date: selectedDate,
        status,
        projectId,
      });
    }

    res.status(200).json(attendance);
  } catch (err) {
    console.error("❌ markAttendance error:", err);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

export const markAllAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ error: "Attendance data is required" });
    }

    const today = new Date();

    const bulkOps = attendance.map((entry) => {
      const cleanDate = new Date(new Date(entry.date).toDateString());

      return {
        updateOne: {
          filter: {
            workerId: new mongoose.Types.ObjectId(entry.workerId),
            date: cleanDate,
            projectId: entry.projectId,
          },
          update: { status: entry.status },
          upsert: true,
        },
      };
    });

    await Attendance.bulkWrite(bulkOps);

    res.status(200).json({ message: "Attendance updated for all workers" });
  } catch (err) {
    console.error("Error in markAllAttendance:", err);
    res.status(500).json({ error: "Failed to apply to all" });
  }
};

export const getWorkerHistory = async (req, res) => {
  try {
    const { workerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({ error: "Invalid worker ID" });
    }

    const history = await Attendance.find({
      workerId: new mongoose.Types.ObjectId(workerId),
    })
      .populate("workerId", "name") // Only show name
      .sort({ date: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ error: "No attendance records found." });
    }

    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching worker history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const getWorkerAttendanceSummary = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // Find accepted job applications for this worker
    const applications = await Application.find({
      workerId: worker._id,
      status: "accepted"
    });

    const summaries = await Promise.all(applications.map(async (app) => {
      const job = await Job.findById(app.jobId);
      const attendance = await Attendance.find({
        workerId: worker._id,
        jobId: app.jobId
      }).sort({ date: 1 });

      const totalPresent = attendance.filter(a => a.status === "Present").length;
      const totalAbsent = attendance.filter(a => a.status === "Absent").length;

      return {
        jobId: app.jobId,
        jobTitle: job.title,
        attendanceRecords: attendance.map(a => ({
          date: a.date,
          status: a.status
        })),
        totalPresent,
        totalAbsent
      };
    }));

    res.status(200).json(summaries);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFullAttendanceHistoryByEmail = async (req, res) => {
  
  const { email } = req.query;
 // console.log("🔍 Looking up full history for:", email);

  if (!email) {
    return res.status(400).json({ error: "Email is required in query params" });
  }
  try {
    // ✅ First: Get the worker by email
    const worker = await User.findOne({ email });
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }
  
    //const workerId = worker._id;
    // ✅ Then: Get all accepted applications
    const acceptedApplications = await Application.find({
      email,
      status: "accepted"
    });
   // console.log("acceptedApplications are", acceptedApplications);
    const results = [];
  
    for (const app of acceptedApplications) {
     // const { jobId, projectId } = app;
    const { _id: applicationId, jobId, projectId } = app;

    //  console.log("🔎 Searching attendance for:");
    //  console.log("  workerId:", applicationId.toString());
    //  console.log("  projectId:", projectId.toString());

      const attendanceRecords = await Attendance.find({
       // workerId: worker._id,
        workerId: applicationId, 
        projectId
      }).sort({ date: 1 });
    //  console.log("📄 Total Attendance Records Found:", attendanceRecords.length);

      const totalPresent = attendanceRecords.filter(r => r.status === 'Present').length;
      const totalAbsent = attendanceRecords.filter(r => r.status === 'Absent').length;
  
      results.push({
        jobId,
        projectId,
        totalPresent,
        totalAbsent,
        attendanceRecords
      });
    }
  
    return res.status(200).json(results);
  
  } catch (error) {
    console.error("🔥 Error in getFullAttendanceHistoryByEmail:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
  
};
