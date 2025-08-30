const { MongoClient } = require("mongodb");

const database = 'ASSIGNMENT';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function claimbyuserid(UID) {
    try {
        
        await client.connect();
       
        const db = client.db(database);
        const collection = db.collection('Claims');

        const data = await collection.find({UID}).toArray();

        return data;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; 
    }
}

module.exports = claimbyuserid; 