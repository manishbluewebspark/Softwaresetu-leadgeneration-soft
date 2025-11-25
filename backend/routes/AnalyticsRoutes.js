import { Router } from "express";
import { 
  getEmployees, 
  getHourlyCalls,
  getCallAnalyticsSummary 
} from "../controllers/analyticsController.js";

const router = Router();

router.get("/employees", getEmployees);
router.get("/hourly-calls", getHourlyCalls);
router.get("/call-summary", getCallAnalyticsSummary);

export default router;