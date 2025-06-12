
import mongoose from "mongoose";

const WorkerRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dailyWage: { type: Number, required: true },
  daysWorked: { type: Number, default: 0 },
  payment: { type: Number, default: 0 },
});

export default mongoose.model("WorkerRecord", WorkerRecordSchema);
