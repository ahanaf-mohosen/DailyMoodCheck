import 'dotenv/config'; // loads .env automatically
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const dbUrl = process.env.DATABASE_URL;

// Determine if this is a Neon database URL or regular PostgreSQL
const isNeonDb = dbUrl.includes('neon.tech') || dbUrl.includes('@ep-');
const isLocalPostgres = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

let pool: any;
let db: any;

if (isNeonDb) {
  // Use Neon serverless configuration
  try {
    neonConfig.webSocketConstructor = ws;
    pool = new NeonPool({ connectionString: dbUrl });
    db = drizzle({ client: pool, schema });
    console.log("🔗 Connected to Neon database");
  } catch (error) {
    console.error('Failed to connect to Neon database:', error);
    throw error;
  }
} else {
  // Use regular PostgreSQL configuration
  try {
    pool = new PgPool({ 
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    db = drizzleNode(pool, { schema });
    console.log("🔗 Connected to PostgreSQL database");
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
    throw error;
  }
}

export { pool, db };