import { afterEach, expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GoogleTagManager } from "./GoogleTagManager";

vi.mock("next/script", () => ({
  default: ({ id, children }: { id: string; children: string }) => (
    <script id={id}>{children}</script>
  ),
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

test("renders nothing when NEXT_PUBLIC_GTM_ID is unset (empty .env builds ship no tracking)", () => {
  vi.stubEnv("NEXT_PUBLIC_GTM_ID", "");
  expect(renderToStaticMarkup(<GoogleTagManager />)).toBe("");
});

test("renders the GTM bootstrap script and noscript iframe for the configured container", () => {
  vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-TEST123");
  const html = renderToStaticMarkup(<GoogleTagManager />);

  expect(html).toContain("googletagmanager.com/gtm.js");
  expect(html).toContain("dataLayer");
  expect(html).toContain('"GTM-TEST123"');
  expect(html).toContain(
    "https://www.googletagmanager.com/ns.html?id=GTM-TEST123",
  );
  expect(html).toContain("<noscript>");
});
