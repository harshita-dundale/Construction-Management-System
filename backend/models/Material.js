import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 👈 No unique
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  unit: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

export default mongoose.model("Material", materialSchema);