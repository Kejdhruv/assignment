const { MongoClient, ObjectId } = require('mongodb');

const database = 'ASSIGNMENT';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function GetUser(email_) {
    try {
        
        await client.connect();
       
        const db = client.db(database);
        const collection = db.collection('Users');

        const data = await collection.find({ email:email_}).toArray();

        return data;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; 
    }
}

module.exports = GetUser;