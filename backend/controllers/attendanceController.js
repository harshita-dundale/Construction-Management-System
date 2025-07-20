import Attendance from "../models/WorkerRecord.js";
import mongoose from "mongoose";
// Create or update attendance for one worker
export const markAttendance = async (req, res) => {
  try {
    const { workerId, date, status, projectId } = req.body;

    const selectedDate = new Date(date);
    const today = new Date();

    if (selectedDate > today) {
      return res
        .status(400)
        .json({ error: "Cannot mark attendance for future date" });
    }
    if (!workerId || !date || !status || !projectId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if already marked
    let attendance = await Attendance.findOne({ workerId, date, projectId });

    if (attendance) {
      attendance.status = status;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        //workerId,
        workerId: new mongoose.Types.ObjectId(workerId),
        date,
        status,
        projectId,
      });
    }
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

// Apply to all workers
export const markAllAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;
    console.log("💾 Incoming Worker IDs:", attendance.map(e => e.workerId));

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ error: "Attendance data is required" });
    }

    const today = new Date();

    // Optional: validate dates
    for (const record of attendance) {
      const selectedDate = new Date(record.date);
      if (selectedDate > today) {
        return res
          .status(400)
          .json({ error: "Cannot mark attendance for future date" });
      }
    }
    console.log("Received attendance payload:", attendance);

    const bulkOps = attendance.map((entry) => ({
      updateOne: {
        filter: {
         // workerId: entry.workerId,
         workerId: new mongoose.Types.ObjectId(entry.workerId),
          date: entry.date,
          projectId: entry.projectId,
        },
        update: { status: entry.status },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    res.status(200).json({ message: "Attendance updated for all workers" });
  } catch (err) {
    console.error("Error in markAllAttendance:", err);
    res.status(500).json({ error: "Failed to apply to all" });
  }
};

// Get worker history
export const getWorkerHistory = async (req, res) => {
  try {
    const { workerId } = req.params;
   // const history = await Attendance.find({ workerId }).sort({ date: -1 });
   const history = await Attendance.find({ workerId })
  .populate("workerId", "name") // 👈 adds only 'name' from User or Application
  .sort({ date: -1 });
  console.log("🔍 populated history:", history);

    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching worker history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};


// Apply to all workers
// export const markAllAttendance = async (req, res) => {
//   try {
//     const { workerIds, date, status, projectId } = req.body;
//     const selectedDate = new Date(date);
//     const today = new Date();

//     if (selectedDate > today) {
//       return res
//         .status(400)
//         .json({ error: "Cannot mark attendance for future date" });
//     }

//     if (!workerIds || workerIds.length === 0 || !date || !status || !projectId) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
    
//     const bulkOps = workerIds.map((id) => ({
//       updateOne: {
//         filter: { workerId: id, date, projectId },
//         update: { status },
//         upsert: true,
//       },
//     }));

//     await Attendance.bulkWrite(bulkOps);
//     res.status(200).json({ message: "Attendance updated for all workers" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to apply to all" });
//   }
// };