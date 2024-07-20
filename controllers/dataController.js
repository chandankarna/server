import mongoose from "mongoose";

// Fetch data from all collections or specific collection based on the PAN Card Number
export const fetchAllData = async (req, res) => {
  try {
    const { panCardNo } = req.query; // Assuming panCardNo is passed as a query parameter

    if (panCardNo) {
      // Convert panCardNo to lowercase to maintain consistency
      const collectionName = panCardNo.toLowerCase();

      // Define the models based on collection names, if not already defined
      const models = {
        personalInfo:
          mongoose.models[`${collectionName}_personalInfo`] ||
          mongoose.model(
            `${collectionName}_personalInfo`,
            new mongoose.Schema({}, { strict: false }),
            `${collectionName}_personalInfo`
          ),
        employment:
          mongoose.models[`${collectionName}_employment`] ||
          mongoose.model(
            `${collectionName}_employment`,
            new mongoose.Schema({}, { strict: false }),
            `${collectionName}_employment`
          ),
        education:
          mongoose.models[`${collectionName}_education`] ||
          mongoose.model(
            `${collectionName}_education`,
            new mongoose.Schema({}, { strict: false }),
            `${collectionName}_education`
          ),
        tax:
          mongoose.models[`${collectionName}_tax`] ||
          mongoose.model(
            `${collectionName}_tax`,
            new mongoose.Schema({}, { strict: false }),
            `${collectionName}_tax`
          ),
        additional:
          mongoose.models[`${collectionName}_additional`] ||
          mongoose.model(
            `${collectionName}_additional`,
            new mongoose.Schema({}, { strict: false }),
            `${collectionName}_additional`
          ),
      };

      const data = {};

      // Fetch data from each collection
      for (const [key, model] of Object.entries(models)) {
        console.log(`Fetching data from collection: ${model.collection.name}`);
        data[key] = await model.find({}).lean();
        console.log(`Data fetched from ${model.collection.name}:`, data[key]);
      }

      res.status(200).json(data);
    } else {
      // Fetch data from all collections when panCardNo is not provided
      const collections = await mongoose.connection.db.collections();
      const data = {};

      for (const collection of collections) {
        const collectionName = collection.collectionName;

        // Skip system collections and numeric collections
        if (collectionName.startsWith("system.") || !isNaN(collectionName)) {
          continue;
        }

        // console.log(`Fetching data from collection: ${collectionName}`);
        const model =
          mongoose.models[collectionName] ||
          mongoose.model(
            collectionName,
            new mongoose.Schema({}, { strict: false }),
            collectionName
          );
        data[collectionName] = await model.find({}).lean();
        // console.log(
        //   `Data fetched from ${collectionName}:`,
        //   data[collectionName]
        // );
      }

      res.status(200).json(data);
    }
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  }
};
