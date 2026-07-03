import {
  type AnyPgColumn,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { Content } from "@/lib/content/content-types";

// Drizzle schema (SPEC §15.2). Ported contract from the AI-WEBSITE-TEMPLATE:
// `sites` points at the live version; `versions` is APPEND-ONLY (never UPDATE a
// version row) — every edit is a new parent-linked row. `posts` (blog, §15.5)
// and `plans` (training plans, §15.6) are added by their own milestones.

/** Who created a version — used by undo/redo detection and the admin log. */
export type VersionAuthor = "seed" | "owner" | "agent" | "undo" | "redo";

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerKey: text("customer_key").notNull().unique(),
  // Points at the live version. Circular FK to versions (deferred arrow).
  currentVersionId: uuid("current_version_id").references(
    (): AnyPgColumn => versions.id,
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const versions = pgTable("versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id),
  parentVersionId: uuid("parent_version_id").references(
    (): AnyPgColumn => versions.id,
  ),
  content: jsonb("content").notNull().$type<Content>(),
  opSummary: text("op_summary"),
  author: text("author").notNull().$type<VersionAuthor>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Site = typeof sites.$inferSelect;
export type Version = typeof versions.$inferSelect;
export type NewVersion = typeof versions.$inferInsert;
