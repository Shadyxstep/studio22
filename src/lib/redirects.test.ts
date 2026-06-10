import { expect, test } from "vitest";
import { LEGACY_REDIRECTS } from "./redirects";

const ROUTES = new Set([
  "/",
  "/facility",
  "/packages",
  "/get-started",
  "/faqs",
  "/contact",
]);

test("every legacy WordPress path from the content inventory has a redirect", () => {
  const sources = LEGACY_REDIRECTS.map((r) => r.source);
  expect(sources.sort()).toEqual(
    [
      "/our-packages",
      "/gym-packages",
      "/pilates-packages",
      "/full-studio-package",
      "/online-coaching",
      "/contact-us",
      "/strength",
      "/reformer-pilates",
      "/golf",
      "/golf-performance-program",
      "/we-are-open",
    ].sort(),
  );
});

test("every redirect destination is a real route", () => {
  for (const r of LEGACY_REDIRECTS) {
    expect(ROUTES.has(r.destination), `bad destination: ${r.destination}`).toBe(
      true,
    );
  }
});

test("no redirect source collides with a live route", () => {
  for (const r of LEGACY_REDIRECTS) {
    expect(ROUTES.has(r.source), `source shadows a route: ${r.source}`).toBe(
      false,
    );
  }
});
