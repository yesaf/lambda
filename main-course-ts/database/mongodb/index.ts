import * as mongodb from 'mongodb';

require("dotenv").config();

export async function connectToCollection (dbName: string, collectionName: string) {
    const client: mongodb.MongoClient = new mongodb.MongoClient(process.env.MONGO_URI || '');

    await client.connect();

    const db: mongodb.Db = client.db(dbName);

    const collection: mongodb.Collection = db.collection(collectionName);

    console.log(`Connected to database: ${db.databaseName} and collection: ${collection.collectionName}`);

    return collection;
}

