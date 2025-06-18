
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  salary: String,
  startDate: String,
  endDate: String,
  location: String,
  Email: String,
  PhoneNo: String,
  image: String, // new field
});

const Job = mongoose.model("Job", jobSchema);

export default Job;