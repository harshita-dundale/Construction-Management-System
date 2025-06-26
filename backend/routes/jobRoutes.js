import express from "express";
import multer from "multer";
import path from "path";
import { postJob, getAllJobs } from "../controllers/jobController.js";

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

// 🔸 Routes
router.post("/", upload.single("image"), postJob);
router.get("/", getAllJobs);

export default router;
