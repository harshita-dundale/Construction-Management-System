import express from "express";
import {
  getProjectsByUserId,
  addProject,
  updateProject,
  deleteProjectById,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/:userId", getProjectsByUserId);
router.post("/", addProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProjectById);

export default router;
