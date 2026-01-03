import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Validate DATABASE_URL at startup but log a clear message instead of crashing
function validateDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('FATAL ERROR: DATABASE_URL environment variable is not set.');
    console.error('');
    console.error('To fix this issue:');
    console.error('1. Set the DATABASE_URL environment variable with your PostgreSQL connection string');
    console.error('2. For Fly.io: Run "fly secrets set DATABASE_URL=<your-connection-string>"');
    console.error('3. For local development: Create a .env file with DATABASE_URL=<your-connection-string>');
    console.error('');
    console.error('Example: DATABASE_URL=postgresql://user:password@localhost:5432/tubestar');
    console.error('');
    // Exit with a clear error code so the process doesn't restart infinitely
    // Exit code 1 indicates an error, Fly.io will see this and may stop restart attempts
    process.exit(1);
  }
  return databaseUrl;
}

const databaseUrl = validateDatabaseUrl();

// Configure connection pool with reasonable limits
export const pool = new Pool({ 
  connectionString: databaseUrl,
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
