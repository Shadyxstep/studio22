import { defineConfig } from "drizzle-kit";

// Migrations are generated from src/lib/db/schema.ts into drizzle/ and applied
// programmatically: PGlite in tests (src/lib/db/test.ts) and `pnpm db:migrate`
// against the real database (SPEC §15.1).
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://localhost:5432/studio22",
  },
});
