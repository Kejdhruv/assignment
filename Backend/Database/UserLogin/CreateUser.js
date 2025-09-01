const { MongoClient } = require("mongodb");

const database = 'ASSIGNMENT';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function CreateUser(user) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Users");

    const result = await collection.insertOne(user);
    return result; 
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

module.exports = CreateUser;