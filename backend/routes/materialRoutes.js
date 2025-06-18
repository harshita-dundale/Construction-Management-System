import express from "express";
import Material from "../models/Material.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, quantity, unitPrice } = req.body;
  const newMaterial = new Material({ name, quantity, unitPrice });
  try {
    const saved = await newMaterial.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/usage", async (req, res) => {
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
});

router.delete("/:id", async (req, res) => {
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
});
export default router;