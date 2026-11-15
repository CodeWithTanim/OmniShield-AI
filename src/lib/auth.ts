import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "omni-shield-ai");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "default_development_secret_key_32_chars_long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
