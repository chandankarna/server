// routes
import express from "express";
import { submitAdditionalDetails } from "../controllers/additionalController.js";

const router = express.Router();

router.post("/submit-additional-details", submitAdditionalDetails);

export default router;
