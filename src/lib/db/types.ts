import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type * as schema from "./schema";

// A Drizzle handle backed by either the runtime pg Pool or the PGlite test DB.
// Query functions accept this so the same access patterns run identically in
// tests (PGlite) and at runtime (Postgres) — SPEC §15.1.
export type Database =
  | NodePgDatabase<typeof schema>
  | PgliteDatabase<typeof schema>;
