import express from "express";
import {
  getAllMaterials,
  createMaterial,
  updateMaterialUsage,
  deleteMaterial,
} from "../controllers/materialController.js";

const router = express.Router();

// 🔹 Routes
router.get("/", getAllMaterials);
router.post("/", createMaterial);
router.patch("/usage", updateMaterialUsage);
router.delete("/:id", deleteMaterial);

export default router;
