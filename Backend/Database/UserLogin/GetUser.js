const { MongoClient } = require('mongodb');

const database = 'ASSIGNMENT';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function GetUser(email) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });

    return user; 
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

module.exports = GetUser;