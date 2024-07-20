// import mongoose from "mongoose";

// // Function to create a dynamic model based on PAN Card number
// export const createDynamicModel = (panCardNo) => {
//   if (!panCardNo || typeof panCardNo !== "string") {
//     throw new Error("Invalid PAN Card Number provided.");
//   }

//   const sanitizedPanCardNo = panCardNo
//     .replace(/[^a-zA-Z0-9_]/g, "_")
//     .toLowerCase();

//   if (mongoose.models[sanitizedPanCardNo]) {
//     return mongoose.models[sanitizedPanCardNo];
//   }

//   const schema = new mongoose.Schema(
//     {
//       personalInfo: mongoose.Schema.Types.Mixed, // Employee Details
//       dependentPersons: [mongoose.Schema.Types.Mixed], // Employee Details
//       professionalReferences: [mongoose.Schema.Types.Mixed], // Employee Details
//       personalReferences: [mongoose.Schema.Types.Mixed], // Employee Details
//       currentEmployment: mongoose.Schema.Types.Mixed, // Employment Details
//       educationDetails: [mongoose.Schema.Types.Mixed], // Education Details
//       taxDetails: mongoose.Schema.Types.Mixed, // Tax Details
//       additionalDetails: mongoose.Schema.Types.Mixed, // Additional Details
//     },
//     { collection: sanitizedPanCardNo, timestamps: true }
//   );

//   return mongoose.model(sanitizedPanCardNo, schema);
// };



// models/dynamicModel.js
import mongoose from "mongoose";

/**
 * Create a dynamic model based on PAN Card number
 * @param {string} panCardNo - PAN Card number to create a model
 * @returns {mongoose.Model} - Mongoose model for the given PAN Card number
 * @throws {Error} - Throws an error if the PAN Card number is invalid
 */

export const createDynamicModel = (panCardNo) => {
  if (!panCardNo || typeof panCardNo !== "string") {
    throw new Error("Invalid PAN Card Number provided.");
  }

  const sanitizedPanCardNo = panCardNo.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();

  // Check if the model already exists to avoid re-compiling
  if (mongoose.models[sanitizedPanCardNo]) {
    return mongoose.models[sanitizedPanCardNo];
  }

  const schema = new mongoose.Schema(
    {
      personalInfo: mongoose.Schema.Types.Mixed,
      dependentPersons: [mongoose.Schema.Types.Mixed],
      professionalReferences: [mongoose.Schema.Types.Mixed],
      personalReferences: [mongoose.Schema.Types.Mixed],
      currentEmployment: mongoose.Schema.Types.Mixed,
      educationDetails: [mongoose.Schema.Types.Mixed],
      taxDetails: mongoose.Schema.Types.Mixed,
      additionalDetails: mongoose.Schema.Types.Mixed,
    },
    { collection: sanitizedPanCardNo, timestamps: true }
  );

  return mongoose.model(sanitizedPanCardNo, schema);
};
