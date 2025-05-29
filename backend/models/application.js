// backend/models/application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  experience: { type: String },
  skills: { type: String },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", applicationSchema);
