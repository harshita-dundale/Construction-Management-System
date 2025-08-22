import express from "express";
import {
  getProjectsByUserId,
  addProject,
  deleteProjectById,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/:userId", getProjectsByUserId);
router.post("/", addProject);
router.delete("/:id", deleteProjectById);

export default router;