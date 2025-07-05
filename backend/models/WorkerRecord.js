import mongoose from "mongoose";

const WorkerRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dailyWage: { type: Number, required: true },
  daysWorked: { type: Number, default: 0 },
  payment: { type: Number, default: 0 },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

export default mongoose.model("WorkerRecord", WorkerRecordSchema);

// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema(
//   {
//     workerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Refers to User with role = 'worker'
//       required: true,
//     },
//     projectId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Present", "Absent"],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Attendance", attendanceSchema);
