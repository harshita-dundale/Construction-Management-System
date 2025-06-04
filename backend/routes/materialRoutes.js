// import express from "express";
// import Material from "../models/Material.js";
// const router = express.Router();
// router.get("/", async (req, res) => {
//   try {
//     const materials = await Material.find();
//     res.json(materials);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching materials" });
//   }
// });
// router.post("/", async (req, res) => {
//   const { name, quantity, unitPrice } = req.body;
//   try {
//     const newMaterial = new Material({ name, quantity, unitPrice });
//     await newMaterial.save();
//     res.status(201).json(newMaterial);
//   } catch (err) {
//     res.status(500).json({ message: "Error adding material" });
//   }
// });

// router.patch("/usage", async (req, res) => {
//   const { name, quantityUsed } = req.body;

//   try {
//     const material = await Material.findOne({ name });

//     if (!material) {
//       return res.status(404).json({ message: "Material not found" });
//     }

//     if (material.quantity < quantityUsed) {
//       return res.status(400).json({ message: "Not enough material in stock" });
//     }

//     material.quantity -= quantityUsed;
//     await material.save();

//     res.json(material);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating usage" });
//   }
// });
// export default router;


import express from "express";
import Material from "../models/Material.js";

const router = express.Router();

// Get all materials
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new material
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

// Update usage
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
export default router;