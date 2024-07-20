import express from "express";
import { fetchAllData } from "../controllers/dataController.js"; // Adjust the path if necessary

const router = express.Router();

router.get("/", fetchAllData);

export default router;
