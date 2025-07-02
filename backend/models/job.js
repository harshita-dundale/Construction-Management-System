import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  salary: String,
  startDate: String,
  endDate: String,
  location: String,
  Email: String,
  PhoneNo: String,
  image: String, 
  userId: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, 
});
jobSchema.index({ userId: 1, title: 1 }, { unique: true });
const Job = mongoose.model("Job", jobSchema);

export default Job;