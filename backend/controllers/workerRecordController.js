import WorkerRecord from "../models/WorkerRecord.js";

// 🔹 Save all records (replaces existing)
export const saveWorkerRecords = async (req, res) => {
  try {
    await WorkerRecord.deleteMany({}); // Remove old records
    const saved = await WorkerRecord.insertMany(req.body); // Insert new records
    res.json({ message: "Saved", data: saved });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
};

// 🔹 Get all records
export const getWorkerRecords = async (req, res) => {
  try {
    const records = await WorkerRecord.find({});
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Fetch error" });
  }
};
