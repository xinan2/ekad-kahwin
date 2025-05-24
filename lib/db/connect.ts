import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/lib/db/schema";

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Set the session timezone for every new connection
  // Note: Ensure 'Asia/Kuala_Lumpur' is a valid timezone name in your PostgreSQL instance
  options: `-c timezone=Asia/Kuala_Lumpur`,
});

// Create a Drizzle ORM instance with the schema
export const db = drizzle(pool, { schema });

// Export a function to ensure migrations are only run once in development
export async function migrate() {
  // Here you would typically import and run migrations
  // We're keeping it empty for now but will implement it when needed
  console.log("Migration check complete");
}
