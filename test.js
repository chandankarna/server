import express from "express";
import mongoose from "mongoose";
import cors from "cors";

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

// Dynamic Schema and Model creation based on PAN Card Number
const createDynamicModel = (panCardNo) => {
  const sanitizedPanCardNo = panCardNo
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .toLowerCase();

  const schema = new mongoose.Schema(
    {
      personalInfo: Object,
      dependentPerson: Object,
      professionalReference: Object,
      personalReference: Object,
    },
    { collection: sanitizedPanCardNo }
  );

  return mongoose.model(sanitizedPanCardNo, schema);
};

// Routes
app.post("/api/submit-form", async (req, res) => {
  const {
    personalInfo,
    dependentPerson,
    professionalReference,
    personalReference,
  } = req.body;
  const panCardNo = personalInfo.panCardNo.toLowerCase();

  try {
    const DynamicFormModel = createDynamicModel(panCardNo);

    // Update existing document or create a new one
    const updateResult = await DynamicFormModel.updateOne(
      { "personalInfo.panCardNo": personalInfo.panCardNo },
      {
        personalInfo,
        dependentPerson,
        professionalReference,
        personalReference,
      },
      { upsert: true, new: true } // upsert will create the document if it doesn't exist
    );

    if (updateResult.upsertedCount > 0) {
      res.status(201).send({ message: "Form submitted successfully!" });
    } else {
      res.status(200).send({ message: "Form updated successfully!" });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    res
      .status(400)
      .send({ message: "Error submitting form", error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
