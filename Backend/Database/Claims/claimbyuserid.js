const { MongoClient } = require("mongodb");

const database = "ASSIGNMENT";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// ✅ Fetch all claims for a user
async function claimByUserId(email) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Claims");
    return await collection.find({ email }).toArray();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

// ✅ Fetch only pending claims
async function claimPendingByUserId(email) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Claims");
    return await collection.find({ email, "review.status": "pending" }).toArray();
  } catch (err) {
    console.error("Error fetching pending claims:", err);
    throw err;
  }
}

// ✅ Fetch only approved claims
async function claimApprovedByUserId(email) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Claims");
    return await collection.find({ email, "review.status": "approved" }).toArray();
  } catch (err) {
    console.error("Error fetching approved claims:", err);
    throw err;
  }
}

// ✅ Fetch only rejected claims
async function claimRejectedByUserId(email) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Claims");
    return await collection.find({ email, "review.status": "rejected" }).toArray();
  } catch (err) {
    console.error("Error fetching rejected claims:", err);
    throw err;
  }
}

module.exports = {
  claimByUserId,
  claimPendingByUserId,
  claimApprovedByUserId,
  claimRejectedByUserId,
};