// server/routes/educationRoutes.js
import express from "express";
import { submitEducationDetails } from "../controllers/educationController.js";

const router = express.Router();

router.post("/submit-education-details", submitEducationDetails);

export default router;
