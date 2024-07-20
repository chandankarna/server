import { createDynamicModel } from "../models/dynamicModel.js";

/**
 * Handle tax details submission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a response object
 */
export const submitTaxDetails = async (req, res) => {
  try {
    const { taxDetails } = req.body;

    // Validate taxDetails
    if (!taxDetails || typeof taxDetails !== "object") {
      return res.status(400).json({ message: "Invalid tax details provided." });
    }

    const { panCardNo } = taxDetails;
    if (!panCardNo || typeof panCardNo !== "string") {
      return res
        .status(400)
        .json({ message: "Valid PAN Card number is required." });
    }

    const DynamicModel = createDynamicModel(panCardNo.toLowerCase());

    // Ensure taxDetails are structured according to schema
    const updateData = { taxDetails };

    const existingRecord = await DynamicModel.findOneAndUpdate(
      { "taxDetails.panCardNo": panCardNo },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Tax details submitted successfully",
      data: existingRecord,
    });
  } catch (error) {
    console.error("Error submitting tax details:", error);
    return res.status(500).json({
      message: "Error submitting tax details",
      error: error.message || "Unknown server error",
    });
  }
};
