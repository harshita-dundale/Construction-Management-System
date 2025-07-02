import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String }, // optional but matches frontend
  experience: { type: String },
  // skills: { type: String },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    //required: true,
  }, 
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["under_review", "accepted", "rejected"],
    default: "under_review",
  },
});

export default mongoose.model("Application", applicationSchema);