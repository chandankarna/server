import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoutes.js";
import employmentRoutes from "./routes/employmentRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";
import additionalRoutes from "./routes/additionalRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const dbURI =
  "mongodb+srv://growthsec:growthsec123@cluster0.thwyyfm.mongodb.net/CIF?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/employee", employeeRoutes);
app.use("/api/employment", employmentRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/additional", additionalRoutes);
app.use("/api/data", dataRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

