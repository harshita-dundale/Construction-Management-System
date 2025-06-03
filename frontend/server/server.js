const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const roleRoutes = require("./routes/roleRoutes");
require("dotenv").config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", roleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const roleRoutes = require("./routes/roleRoutes");
// const applicationRoutes = require("./routes/apply"); // 👈 add this

// require("dotenv").config();
// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api", roleRoutes);
// app.use("/api/applications", applicationRoutes); // 👈 mount here

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));