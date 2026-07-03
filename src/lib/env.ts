// Env loader for the v2 platform (SPEC §15.1). Every var is optional: absent
// DATABASE_URL → file-fallback content; absent ANTHROPIC_API_KEY → fake planner;
// absent OWNER_PASSWORD_HASH → dev fallback password outside production. Kept
// dependency-free; features must be demonstrable with an empty .env (SPEC §5).

export interface Env {
  databaseUrl?: string;
  ownerPasswordHash?: string;
  sessionSecret?: string;
  anthropicApiKey?: string;
  blobToken?: string;
  siteUrl: string;
}

/** Treat empty strings (as in `.env.example`) as absent. */
function opt(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function loadEnv(
  source: Record<string, string | undefined> = process.env,
): Env {
  return {
    databaseUrl: opt(source.DATABASE_URL),
    ownerPasswordHash: opt(source.OWNER_PASSWORD_HASH),
    sessionSecret: opt(source.SESSION_SECRET),
    anthropicApiKey: opt(source.ANTHROPIC_API_KEY),
    blobToken: opt(source.BLOB_READ_WRITE_TOKEN),
    siteUrl: opt(source.NEXT_PUBLIC_SITE_URL) ?? "https://studio-22.ie",
  };
}

/** The planner/drafter is real only when a key is present; fake otherwise. */
export function llmMode(env: Env = loadEnv()): "fake" | "real" {
  return env.anthropicApiKey ? "real" : "fake";
}

/** Content serving mode: DB-backed when configured, file fallback otherwise. */
export function contentMode(env: Env = loadEnv()): "db" | "files" {
  return env.databaseUrl ? "db" : "files";
}
