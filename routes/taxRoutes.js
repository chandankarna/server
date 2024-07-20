import express from "express";
import { submitTaxDetails } from "../controllers/taxController.js";

const router = express.Router();

router.post("/submit-tax-details", submitTaxDetails);

export default router;
