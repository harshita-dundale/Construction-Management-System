// import express from "express";
// import authRoutes from "./routes/authRoutes.js";
// import mongoose, { mongo } from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import jobRoutes from "./routes/jobRoutes.js";

// dotenv.config();
// const app = express();

// // ✅ Middlewares
// app.use(cors());
// app.use(express.json());

// // ✅ Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/jobs", jobRoutes);

// const mongoURI = process.env.DB_URI || "";

// if (!mongoURI) {
//   console.error("MongoDB URI is missing in .env file!");
//   process.exit(1);
// }

// mongoose
//   .connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// app.get("/", (req, res) => {
//   res.send("Backend is running! ");
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




import express from "express";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jobRoutes from "./routes/jobRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// To get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

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
