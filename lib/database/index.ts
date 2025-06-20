import dotenv from "dotenv";
dotenv.config();

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as relations from "./schema";

// Typy globalne (wystarczy raz dla całego projektu)
declare global {
  // eslint-disable-next-line no-var
  var _appPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _appDb: NodePgDatabase<typeof schema & typeof relations> | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is not set in environment variables.");
}

// Reużywanie połączenia w dev (hot reload-friendly)
const pool =
  process.env.NODE_ENV === "development"
    ? global._appPool ?? (global._appPool = new Pool({ connectionString }))
    : new Pool({ connectionString });

const db =
  process.env.NODE_ENV === "development"
    ? global._appDb ?? (global._appDb = drizzle(pool, { schema: { ...schema, ...relations } }))
    : drizzle(pool, { schema: { ...schema, ...relations } });

// Sprawdzenie połączenia na starcie
(async () => {
  try {
    await db.execute(`SELECT 1`);
    if (process.env.NODE_ENV !== "production") {
      console.log("🗄️  Database connection established.");
    }
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err);
    process.exit(1);
  }
})();

export default db;
export { pool };
export type DbInstance = typeof db;
