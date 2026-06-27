/**
 * src/client.ts
 *
 * Creates a Drizzle ORM client backed by postgres.js.
 *
 * Design: accepts databaseUrl as a parameter rather than importing directly
 * from @aeternum/config. This keeps packages/db dependency-free and testable
 * in isolation — callers (keeper, future services) pass env.DATABASE_URL at
 * the call site.
 *
 * Usage:
 *   import { createDbClient } from "@aeternum/db";
 *   import { env } from "@aeternum/config";
 *
 *   const db = createDbClient(env.DATABASE_URL);
 */

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./queries.js";

export type DbClient = ReturnType<typeof createDbClient>;

/**
 * Creates and returns a Drizzle ORM client connected to the given PostgreSQL URL.
 * The underlying postgres.js connection is managed internally.
 *
 * Call this once at app startup and reuse the returned instance throughout
 * the process lifetime. Do not create multiple clients in the same process.
 */
export function createDbClient(databaseUrl: string) {
  const sql = postgres(databaseUrl, {
    // Ponder maintains its own connection pool. The keeper only reads,
    // so a small pool is sufficient.
    max: 5,
    idle_timeout: 30,
    connect_timeout: 10,
  });

  return drizzle(sql, { schema });
}