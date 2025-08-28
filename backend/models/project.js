import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: "" },
  location: { type: String, default: "" },
  clientName: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  email: { type: String, default: "" },
  startDate: { type: Date },
  expectedEndDate: { type: Date },
  expectedCost: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});
projectSchema.index({ userId: 1, name: 1 }, { unique: true });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;