const { MongoClient } = require("mongodb");

const database = "ASSIGNMENT";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function claims() {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Claims");

    const data = await collection
      .find({ "review.status": "pending" })
      .sort({ createdAt: 1 })
      .toArray();

    return data;
  } catch (err) {
    console.error("Error fetching pending claims:", err);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = claims; 

