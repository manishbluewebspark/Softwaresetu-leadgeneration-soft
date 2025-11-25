import express from "express";
import { createTemplate, getTemplates, deleteTemplate, updateTemplate, getSingleTemplates } from "../controllers/templateController.js";

const router = express.Router();

router.post("/add", createTemplate);
router.get("/all", getTemplates);
router.get("/", getSingleTemplates);
router.delete("/delete/:id", deleteTemplate);
router.put("/update/:id", updateTemplate);

export default router;
