const { MongoClient } = require("mongodb");

const database = 'ASSIGNMENT';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function Addclaim(claim) {
    try {
        if (!Array.isArray(claim)) {
            throw new Error("Input must be an array");
        }
        await client.connect();
      
        const db = client.db(database);
        const collection = db.collection('Claims');

        const result = await collection.insertMany(claim);
        return result;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; 
    } finally {
    
        await client.close();
    }
}

module.exports = Addclaim;