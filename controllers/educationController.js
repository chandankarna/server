import { createDynamicModel } from "../models/dynamicModel.js";

export const submitEducationDetails = async (req, res) => {
  const { panCardNo, educationDetails } = req.body;

  if (!panCardNo || !educationDetails) {
    return res.status(400).json({
      message: "PAN Card Number and Education Details are required",
    });
  }

  if (!Array.isArray(educationDetails)) {
    return res.status(400).json({
      message: "Education Details should be an array",
    });
  }

  try {
    const EducationModel = createDynamicModel(panCardNo);

    // Find the document by PAN Card Number
    const existingDocument = await EducationModel.findOne({
      "personalInfo.panCardNo": panCardNo,
    });

    if (existingDocument) {
      // Use $set to update the educationDetails field
      await EducationModel.updateOne(
        { "personalInfo.panCardNo": panCardNo },
        { $set: { educationDetails } } // Replace the entire educationDetails array
      );

      return res.status(200).json({
        message: "Education details updated successfully",
      });
    } else {
      // If the document doesn't exist, create a new one
      const newDocument = new EducationModel({
        personalInfo: { panCardNo }, // Ensure this is set if needed
        educationDetails,
      });

      await newDocument.save();

      return res.status(201).json({
        message: "Education details added successfully",
      });
    }
  } catch (error) {
    console.error("Error saving education details:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
