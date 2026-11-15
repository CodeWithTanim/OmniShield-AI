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
    autoSignIn: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "default_development_secret_key_32_chars_long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: (request) => {
    const origin = request?.headers?.get("origin");
    const referer = request?.headers?.get("referer");
    const host = request?.headers?.get("host");
    const origins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "https://*.vercel.app",
      "https://*.trycloudflare.com",
    ];
    if (origin) {
      try {
        origins.push(new URL(origin).origin);
      } catch {}
    }
    if (referer) {
      try {
        origins.push(new URL(referer).origin);
      } catch {}
    }
    if (host) {
      origins.push(`http://${host}`);
      origins.push(`https://${host}`);
    }
    return origins;
  },
  advanced: {
    disableOriginCheck: true,
    disableCSRFCheck: true,
  },
});
