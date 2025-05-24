import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Try loading from .env.local first, then fallback to .env
dotenv.config({
  path: ".env.local",
  override: true,
});

if (!process.env.DATABASE_URL) {
  dotenv.config({
    path: ".env",
    override: true,
  });
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
