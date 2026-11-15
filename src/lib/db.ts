import { MongoClient, Db } from "mongodb";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "omni-shield-ai";

if (!uri) {
  console.warn("MONGODB_URI is not defined in environment variables");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export async function connectMongoose() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(uri, {
    dbName: dbName,
  });
}
