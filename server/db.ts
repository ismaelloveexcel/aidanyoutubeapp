import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with reasonable limits
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout after 10 seconds when connecting
});

// Handle pool errors with proper error recovery
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
  // In production, you might want to:
  // 1. Send alerts to monitoring service
  // 2. Attempt to reconnect
  // 3. Gracefully shutdown if unrecoverable
  if (process.env.NODE_ENV === 'production') {
    console.error('Database connection lost. Application may need to be restarted.');
  }
});

// Graceful shutdown handler with mutex to prevent race conditions
let isShuttingDown = false;
const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) {
    console.log(`${signal} received, but shutdown already in progress...`);
    return;
  }
  isShuttingDown = true;
  console.log(`${signal} received, closing database pool...`);
  try {
    await pool.end();
    console.log('Database pool closed successfully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export const db = drizzle(pool, { schema });
