import express from "express";
import { deleteOfferLetter, generateOfferLetter, generatePDF, getOfferLetters } from "../controllers/offerLetterController.js";

const router = express.Router();

router.post("/generate", generateOfferLetter);

router.get("/", getOfferLetters);

router.post("/generate-pdf", generatePDF);

router.delete('/:id', deleteOfferLetter);

export default router;
