import { createDynamicModel } from "../models/dynamicModel.js";

export const submitEmploymentDetails = async (req, res) => {
  const { employmentDetails } = req.body;

  // Validate employmentDetails
  if (
    !employmentDetails ||
    !Array.isArray(employmentDetails) ||
    employmentDetails.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "No valid employment details provided." });
  }

  const { panCardNo } = employmentDetails[0]; // Assuming panCardNo is in the first item

  if (!panCardNo) {
    return res.status(400).json({ message: "PAN Card Number is required." });
  }

  try {
    const DynamicFormModel = createDynamicModel(panCardNo.toLowerCase());

    const existingDocument = await DynamicFormModel.findOne({
      "personalInfo.panCardNo": panCardNo,
    });

    if (!existingDocument) {
      return res.status(404).json({
        message:
          "PAN Card Number does not exist. Please submit the initial form data first.",
      });
    }

    const updateResult = await DynamicFormModel.updateOne(
      { "personalInfo.panCardNo": panCardNo },
      { $set: { currentEmployment: employmentDetails } },
      { upsert: false }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        message: "No matching document found to update.",
      });
    }

    const responseMessage =
      updateResult.modifiedCount > 0
        ? "Employment details updated successfully!"
        : "No changes made to employment details.";

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("Error submitting employment details:", error);
    res.status(500).json({
      message: "Error submitting employment details",
      error: error.message || "Unknown server error",
    });
  }
};
