import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
projectSchema.index({ userId: 1, name: 1 }, { unique: true });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;