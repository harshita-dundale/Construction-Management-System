import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import applyRoutes from "./routes/apply.js";
import materialRoutes from "./routes/materialRoutes.js"; 
import workerRecordsRoutes from "./routes/worker-records.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();
const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// ✅ Middlewares
app.use(cors());
app.use(express.json());
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/materials", materialRoutes); 
app.use("/api/worker-records", workerRecordsRoutes);
app.use("/api/attendance", attendanceRoutes);

const mongoURI = process.env.DB_URI || "";

if (!mongoURI) {
  console.error("MongoDB URI is missing in .env file!");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running! ");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
