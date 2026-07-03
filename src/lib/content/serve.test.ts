import { beforeEach, describe, expect, it, vi } from "vitest";

// next/cache is unavailable outside a Next server context — mock the two APIs
// serve.ts uses. unstable_cache: identity wrapper (caching is Next's concern,
// not this unit's); revalidateTag: a spy we assert on.
const { revalidateTagSpy } = vi.hoisted(() => ({ revalidateTagSpy: vi.fn() }));
vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  revalidateTag: revalidateTagSpy,
}));

import { CONTENT_TAG, getContent, getPageContent, revalidateContent } from "./serve";

describe("content serving (file-fallback mode — empty env)", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    revalidateTagSpy.mockClear();
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
    await expect(getPageContent("nope")).rejects.toThrow('unknown page');
  });

  it("revalidateContent invalidates the content tag", async () => {
    await revalidateContent();
    expect(revalidateTagSpy).toHaveBeenCalledWith(CONTENT_TAG);
  });
});
