// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL with authentication options
const url = process.env.MONGO_URL;
const dbName = "giftdb";

let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    if (!url || !url.startsWith("mongodb://") && !url.startsWith("mongodb+srv://")) {
        throw new Error("Invalid MONGO_URL in .env. Make sure it starts with 'mongodb://' or 'mongodb+srv://'");
    }

    try {
        console.log("Connecting to MongoDB at:", url);
        const client = new MongoClient(url, { useUnifiedTopology: true });
        await client.connect();
        dbInstance = client.db(dbName);
        console.log("Connected to database:", dbName);
        return dbInstance;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

module.exports = connectToDatabase;
