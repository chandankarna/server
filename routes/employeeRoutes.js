import express from "express";
import { submitEmployeeDetails } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/submit-employee-details", submitEmployeeDetails);

export default router;
