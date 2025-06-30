import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Auth0 User ID
  projects: [
    {
      name: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

// const Project = mongoose.model("Project", projectSchema);
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
