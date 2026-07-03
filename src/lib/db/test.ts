import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";

// In-memory Postgres for tests (SPEC §15.1): PGlite + the same generated
// migrations as runtime, applied programmatically. Zero external services.
// Resolved from cwd (repo root under vitest and tsx) — import.meta.url is not a
// file: URL under the jsdom test environment.
const migrationsFolder = path.resolve(process.cwd(), "drizzle");

export type TestDb = ReturnType<typeof drizzle<typeof schema>>;

export interface TestDbHandle {
  db: TestDb;
  client: PGlite;
}

export async function createTestDb(): Promise<TestDbHandle> {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder });
  return { db, client };
}
