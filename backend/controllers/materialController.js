import Material from "../models/Material.js";

// 🔹 Get All Materials
export const getAllMaterials = async (req, res) => {
  const { projectId } = req.query;

  try {
    const materials = await Material.find({ projectId });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Create New Material
export const createMaterial = async (req, res) => {
  const { name, quantity, unitPrice, projectId } = req.body;

  const newMaterial = new Material({ name, quantity, unitPrice, projectId });
  try {
    const saved = await newMaterial.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Update Usage
export const updateMaterialUsage = async (req, res) => {
  const { name, quantityUsed } = req.body;
  try {
    const material = await Material.findOne({ name });
    if (!material) return res.status(404).json({ message: "Material not found" });

    material.quantity -= quantityUsed;
    if (material.quantity < 0) material.quantity = 0;

    await material.save();
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Delete Material by ID
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await Material.findByIdAndDelete(id);
    if (!deletedMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete material" });
  }
};
