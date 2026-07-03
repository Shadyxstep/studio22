import { describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";

// T5.1 smoke: in-memory Postgres works with zero external services (SPEC §15.1).
// The typed Drizzle harness (createTestDb) arrives with the schema in T5.2.
describe("PGlite smoke", () => {
  it("runs SQL in-memory with no external services", async () => {
    const client = new PGlite();
    const result = await client.query<{ sum: number }>("SELECT 1 + 1 AS sum");
    expect(result.rows[0].sum).toBe(2);
    await client.close();
  });
});
