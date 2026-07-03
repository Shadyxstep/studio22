import type { SectionType } from "@/lib/content/schema";
import type { GlobalTarget } from "@/lib/content/ops";

// The owner's edit scopes (SPEC §15.4) — enforced server-side by the executor,
// never by the prompt. Deliberately generous (it's the owner's own site) but
// with hard rails around things that break the build or the brand: nav/footer
// wiring, checkout copy, pillar imagery config, and Stripe fields stay manual.

export interface EditScopes {
  /** Fields the agent may edit per section type (set_prop path[0]). */
  editableFields: Record<SectionType, readonly string[]>;
  /** Section types the agent may insert. */
  insertableTypes: readonly SectionType[];
  /** For target "site": allowed first path segments. Others: whole-target edits allowed. */
  siteFields: readonly string[];
  /** Global targets the agent may touch at all. */
  targets: readonly GlobalTarget[];
  /** Package fields the agent may edit (set_global target "packages", path [i, field]). */
  packageFields: readonly string[];
}

export const STUDIO22_SCOPES: EditScopes = {
  editableFields: {
    hero: ["label", "headline", "sub", "ctas"],
    pillarGrid: ["heading", "tagline"],
    editorialSplit: ["label", "headline", "paragraphs", "bullets", "cta"],
    statBar: ["stats"],
    packageGrid: ["heading"],
    packageTeaser: ["heading", "tagline", "limit", "cta"],
    testimonials: ["heading", "sub", "limit"],
    gallery: ["heading"],
    faqAccordion: ["heading"],
    ctaBanner: ["headline", "body", "cta"],
    contactPanel: ["heading", "sub"],
    bookingEmbed: ["heading", "body", "fallback"],
  },
  insertableTypes: [
    "editorialSplit",
    "statBar",
    "testimonials",
    "faqAccordion",
    "ctaBanner",
    "gallery",
  ],
  siteFields: ["contact", "sauna", "signup", "reviewCta", "packageCta"],
  targets: ["site", "packages", "testimonials", "faqs"],
  packageFields: ["name", "price", "features"],
};

// House guardrails surfaced to the planner prompt (advisory; the executor is
// the real boundary above).
export const GUARDRAILS = [
  "Never change the studio's name or navigation.",
  "Never invent facts, prices, or testimonials — only apply what the owner stated.",
  "Keep the tone confident and plain; no exclamation marks.",
];
