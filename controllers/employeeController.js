import { createDynamicModel } from "../models/dynamicModel.js";

export const submitEmployeeDetails = async (req, res) => {
  const {
    personalInfo,
    dependentPersons,
    professionalReferences,
    personalReferences,
  } = req.body.employeeDetails;

  // console.log("Received personalInfo:", personalInfo); 

  if (!personalInfo || !personalInfo.panCardNo) {
    console.error("Missing PAN Card Number in personalInfo:", req.body); 
    return res.status(400).json({ message: "PAN Card Number is required in personalInfo." });
  }

  const panCardNo = personalInfo.panCardNo.toUpperCase();

  try {
    const DynamicFormModel = createDynamicModel(panCardNo);

    const updateResult = await DynamicFormModel.updateOne(
      { "personalInfo.panCardNo": panCardNo },
      {
        $set: {
          personalInfo,
          dependentPersons,
          professionalReferences,
          personalReferences,
        },
      },
      { upsert: true }
    );

    const responseMessage =
      updateResult.upsertedCount > 0
        ? "Employee details submitted successfully!"
        : "Employee details updated successfully!";

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("Error submitting employee details:", error);
    res.status(500).json({
      message: "Error submitting employee details",
      error: error.message,
    });
  }
};
