import dotenv from "dotenv";
import { Pool } from "pg";

const env = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${env}` });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const query = (text: string, params?: unknown[]) => pool.query(text, params);

export { pool, query };
