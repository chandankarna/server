import { createDynamicModel } from "../models/dynamicModel.js";

// Controller function to handle submission of additional details
export const submitAdditionalDetails = async (req, res) => {
  const { additionalDetails } = req.body;

  // Validate additionalDetails
  if (
    !additionalDetails ||
    typeof additionalDetails !== "object" ||
    !additionalDetails.panCardNo
  ) {
    return res.status(400).json({
      message:
        "PAN Card Number is required and additionalDetails must be provided.",
    });
  }

  const { panCardNo } = additionalDetails;

  if (!panCardNo) {
    return res.status(400).json({
      message: "PAN Card Number is required.",
    });
  }

  try {
    const DynamicModel = createDynamicModel(panCardNo.toLowerCase());

    // Find the existing record by PAN Card Number
    const existingDocument = await DynamicModel.findOne({
      "personalInfo.panCardNo": panCardNo,
    });

    if (!existingDocument) {
      return res.status(404).json({
        message:
          "PAN Card Number does not exist. Please submit the initial form data first.",
      });
    }

    // Update the existing record with new additional details
    const updateResult = await DynamicModel.updateOne(
      { "personalInfo.panCardNo": panCardNo },
      { $set: { additionalDetails } },
      { upsert: false }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        message: "No matching document found to update.",
      });
    }

    const responseMessage =
      updateResult.modifiedCount > 0
        ? "Additional details updated successfully!"
        : "No changes made to additional details.";

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("Error submitting additional details:", error);
    res.status(500).json({
      message: "Error submitting additional details",
      error: error.message || "Unknown server error",
    });
  }
};
