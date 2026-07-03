import { describe, expect, it } from "vitest";
import { contentMode, llmMode, loadEnv } from "./env";

describe("loadEnv", () => {
  it("treats empty strings as absent (as in .env.example)", () => {
    const env = loadEnv({
      DATABASE_URL: "",
      OWNER_PASSWORD_HASH: "  ",
      ANTHROPIC_API_KEY: "",
    });
    expect(env.databaseUrl).toBeUndefined();
    expect(env.ownerPasswordHash).toBeUndefined();
    expect(env.anthropicApiKey).toBeUndefined();
  });

  it("defaults the site URL and reads set values", () => {
    expect(loadEnv({}).siteUrl).toBe("https://studio-22.ie");
    const env = loadEnv({
      DATABASE_URL: "postgres://x/y",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });
    expect(env.databaseUrl).toBe("postgres://x/y");
    expect(env.siteUrl).toBe("http://localhost:3000");
  });

  it("derives modes: fake/files with empty env, real/db when configured", () => {
    expect(llmMode(loadEnv({}))).toBe("fake");
    expect(contentMode(loadEnv({}))).toBe("files");
    expect(llmMode(loadEnv({ ANTHROPIC_API_KEY: "sk-test" }))).toBe("real");
    expect(contentMode(loadEnv({ DATABASE_URL: "postgres://x/y" }))).toBe("db");
  });
});
