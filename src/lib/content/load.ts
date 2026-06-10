import fs from "fs";
import path from "path";
import { z } from "zod";
import {
  FaqsFileSchema,
  PackagesSchema,
  PageSchema,
  SiteSchema,
  TestimonialsFileSchema,
  type Faq,
  type Package,
  type Page,
  type PageName,
  type Site,
  type Testimonial,
} from "./schema";

export class ContentValidationError extends Error {
  constructor(
    public readonly source: string,
    detail: string,
  ) {
    super(`Invalid content in ${source}: ${detail}`);
    this.name = "ContentValidationError";
  }
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((i) => `${i.path.join(".") || "(root)"} — ${i.message}`)
    .join("; ");
}

/** Pure parse step — unit-testable without the filesystem. */
export function parseContent<T>(
  schema: z.ZodType<T>,
  data: unknown,
  source: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ContentValidationError(source, formatIssues(result.error));
  }
  return result.data;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson(relPath: string): unknown {
  const file = path.join(CONTENT_DIR, relPath);
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf-8");
  } catch {
    throw new ContentValidationError(relPath, "file is missing or unreadable");
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new ContentValidationError(
      relPath,
      `not valid JSON (${e instanceof Error ? e.message : String(e)})`,
    );
  }
}

export function loadSite(): Site {
  return parseContent(SiteSchema, readJson("site.json"), "site.json");
}

export function loadPackages(): Package[] {
  return parseContent(
    PackagesSchema,
    readJson("packages.json"),
    "packages.json",
  );
}

export function loadTestimonials(): Testimonial[] {
  return parseContent(
    TestimonialsFileSchema,
    readJson("testimonials.json"),
    "testimonials.json",
  );
}

export function loadFaqs(): Faq[] {
  return parseContent(FaqsFileSchema, readJson("faqs.json"), "faqs.json");
}

export function loadPage(name: PageName): Page {
  const rel = path.join("pages", `${name}.json`);
  return parseContent(PageSchema, readJson(rel), rel);
}

export type Globals = {
  site: Site;
  packages: Package[];
  testimonials: Testimonial[];
  faqs: Faq[];
};

/** Everything the section renderer needs beyond the page file itself. */
export function loadGlobals(): Globals {
  return {
    site: loadSite(),
    packages: loadPackages(),
    testimonials: loadTestimonials(),
    faqs: loadFaqs(),
  };
}
