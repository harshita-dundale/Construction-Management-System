import { updateJob,  } from "../controllers/jobController.js";
import { deleteJob } from "../controllers/jobController.js";

import express from "express";
import multer from "multer";
import path from "path";
import { 
  postJob, 
  getAllJobs, 
  getBuilderJobsByProjects, 
  getJobsByProject 
} from "../controllers/jobController.js";

const router = express.Router();

// 🔸 Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// 🔹 Job Routes
router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), postJob);
router.get("/", getAllJobs);
router.get("/builder/:userId", getBuilderJobsByProjects);
router.get("/project/:projectId", getJobsByProject);
router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), updateJob);
router.delete("/:id", deleteJob);

export default router;