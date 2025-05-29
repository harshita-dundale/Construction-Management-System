
// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     salary: { type: Number, required: true },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     location: { type: String, required: true },
//     PhoneNo: { type: Number, required: true },
//     builderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Job = mongoose.model("Job", jobSchema);
// export default Job;


import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  salary: String,
  startDate: String,
  endDate: String,
  location: String,
  Email: String,
  // builderId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  PhoneNo: String,
  image: String, // new field
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
