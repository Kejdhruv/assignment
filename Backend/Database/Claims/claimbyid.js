const { MongoClient, ObjectId } = require('mongodb');

const database = 'ASSIGNMENT';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function claimbyid(_id) {
    try {
        
        await client.connect();
       
        const db = client.db(database);
        const collection = db.collection('Claims');

        const data = await collection.find({ _id: new ObjectId(_id) }).toArray();

        return data;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; 
    }
}

module.exports = claimbyid;