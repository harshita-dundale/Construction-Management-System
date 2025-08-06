// import express from "express";
// import multer from "multer";
// import path from "path";
// //import { postJob, getAllJobs } from "../controllers/jobController.js";
// import { 
//   postJob, 
//   getAllJobs, 
//   getBuilderJobsByProjects, 
//   getJobsByProject ,updateJob,deleteJob
// } from "../controllers/jobController.js";
// const router = express.Router();

// // 🔸 Multer Configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const filename = Date.now() + ext;
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage });

// // 🔸 Routes
// // router.post("/", upload.single("image"), postJob);
// router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), postJob);
// router.get("/", getAllJobs);
// router.get("/builder/:userId", getBuilderJobsByProjects);
// router.get("/project/:projectId", getJobsByProject);
// router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), updateJob);
// router.delete("/:id", deleteJob);

// export default router;



import express from "express";
import { 
  postJob, 
  getAllJobs, 
  getBuilderJobsByProjects, 
  getJobsByProject,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";
import { upload } from "../middleware/upload.js"; // ✅ Import the new Cloudinary upload middleware

const router = express.Router();

// ✅ Post job with image upload to Cloudinary
router.post("/", upload.single("image"), postJob);

// ✅ Get all jobs
router.get("/", getAllJobs);

// ✅ Get builder jobs grouped by project
router.get("/builder/:userId", getBuilderJobsByProjects);

// ✅ Get jobs for a specific project
router.get("/project/:projectId", getJobsByProject);

// ✅ Update job (image will also go to Cloudinary if provided)
router.put("/:id", upload.single("image"), updateJob);

// ✅ Delete job
router.delete("/:id", deleteJob);
export default router;
