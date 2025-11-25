import { Router } from "express";
import { AcivateHistoryForAdmin, AcivateHistoryForUser, getCustomerNotes, saveCustomerNotes } from "../controllers/ActivityController.js";

const router = Router();


router.get('/history', AcivateHistoryForAdmin);


router.get('/:id', AcivateHistoryForUser);

router.post("/customer-notes/:customer_id", saveCustomerNotes);
router.get("/get-customer-notes/:customer_id", getCustomerNotes);



export default router;