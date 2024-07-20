import express from "express";
import { submitEmploymentDetails } from "../controllers/employmentController.js";

const router = express.Router();

router.post("/submit-employment-details", submitEmploymentDetails);

export default router;
