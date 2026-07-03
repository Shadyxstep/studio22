import { getDb } from "@/lib/db/client";
import { seedSite } from "@/lib/content/seed";

// `pnpm db:seed` — install content/*.json as the site's first version (SPEC
// §15.2). Idempotent; run after `pnpm db:migrate` against a fresh database.
async function main() {
  const { created, site } = await seedSite(getDb());
  console.log(
    created
      ? `Seeded site ${site.customerKey} (version ${site.currentVersionId})`
      : `Site ${site.customerKey} already seeded — nothing to do`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
