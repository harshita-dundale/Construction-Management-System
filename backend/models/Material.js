import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  unit: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

// ✅ Compound index: unique per project
materialSchema.index({ name: 1, projectId: 1 }, { unique: true });

export default mongoose.model("Material", materialSchema);
