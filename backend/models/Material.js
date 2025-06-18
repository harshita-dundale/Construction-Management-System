import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

export default mongoose.model("Material", materialSchema);