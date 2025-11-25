import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createEmployee, getEmployees, upload, singleEmployee, assignBatch, getEmployeeById, editEmployee, getEmployeeData, getAssignedCustomersByStatus, singleTargertEmployee, getCustomerDetailsByEmployeeId, assignSingleCustomer, getSourceData, getAssignSourceData, toggleStatusChange, getEmployeesForCheck, getEmployeesWithPending } from "../controllers/employeeController.js";

const router = Router();

router.get("/get",  getEmployees);

router.get("/get-active",  getEmployeesForCheck);

router.get("/get-active-pending",  getEmployeesWithPending);

router.post("/add", upload.single("avatar"),createEmployee);

router.get("/single", singleEmployee);

router.get("/get-source-data",  getSourceData); 

router.get("/get-assign-source-data",  getAssignSourceData);

router.get("/target", singleTargertEmployee);

router.get("/status", getEmployeeData);

router.post("/assign",  assignBatch);

router.post("/assign-single", assignSingleCustomer);


router.get("/:id", getEmployeeById);

router.put("/edit/:id", upload.single("avatar"), editEmployee);

router.get("/status/data",  getAssignedCustomersByStatus);

router.get("/customer-details/:id", getCustomerDetailsByEmployeeId);

router.put("/status/:id", toggleStatusChange);


export default router;
