import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { loadEnv } from "@/lib/env";
import * as schema from "./schema";

// Runtime database client: a pooled pg connection (dev/prod). Tests never import
// this — they use createTestDb() (db/test.ts) backed by PGlite. Callers must
// check contentMode()/databaseUrl before reaching here; getDb throws when no
// DATABASE_URL is configured (SPEC §15.1: absent DB → file fallback, not a crash
// at import time).
let pool: Pool | undefined;

export function getDb() {
  const { databaseUrl } = loadEnv();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured (file-fallback mode)");
  }
  if (!pool) pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema });
}
