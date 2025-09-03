const { MongoClient, ObjectId } = require("mongodb");

const database = "ASSIGNMENT";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function UpdateClaim(id, updateData) {
  try {
    if (!id || !updateData) {
      throw new Error("Claim ID and update data are required");
    }

    await client.connect();

    const db = client.db(database);
    const collection = db.collection("Claims");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return result;
  } catch (err) {
    console.error("Error updating claim by ID:", err);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = UpdateClaim;