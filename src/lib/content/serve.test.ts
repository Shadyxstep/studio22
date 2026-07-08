import { beforeEach, describe, expect, it } from "vitest";
import { getContent, getPageContent } from "./serve";

describe("content serving (file-fallback mode — empty env)", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  it("serves the seed transform of content/*.json when no DATABASE_URL is set", async () => {
    const content = await getContent();
    expect(Object.keys(content.pages)).toHaveLength(7);
    // sections carry the deterministic ids the seed assigns
    expect(content.pages.home.sections[0].id).toMatch(/^home\./);
  });

  it("getPageContent returns the page plus globals in one shape", async () => {
    const { page, globals } = await getPageContent("packages");
    expect(page.sections.length).toBeGreaterThan(0);
    expect(globals.site.name).toBeTruthy();
    expect(globals.packages.length).toBeGreaterThan(0);
  });

  it("rejects unknown pages", async () => {
    // @ts-expect-error — deliberately invalid page name
    await expect(getPageContent("nope")).rejects.toThrow("unknown page");
  });
});
