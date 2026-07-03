import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingEmbed } from "./BookingEmbed";
import { SectionSchema } from "@/lib/content/schema";
import { loadGlobals, loadPage } from "@/lib/content/load";

vi.mock("next/navigation", () => ({ usePathname: () => "/book" }));

const globals = loadGlobals();

const IFRAME_SECTION = {
  type: "bookingEmbed" as const,
  heading: "Book a discovery call",
  body: "Pick a time.",
  mode: "iframe" as const,
  src: "https://calendar.example/embed",
  fallback: { label: "Open The Calendar", href: "https://calendar.example" },
};

test("schema accepts both modes and rejects iframe-without-src / missing fallback", () => {
  expect(SectionSchema.safeParse(IFRAME_SECTION).success).toBe(true);
  expect(
    SectionSchema.safeParse({
      type: "bookingEmbed",
      heading: "Members",
      mode: "link",
      fallback: { label: "Open", href: "https://x.example" },
    }).success,
  ).toBe(true);
  expect(
    SectionSchema.safeParse({ ...IFRAME_SECTION, src: undefined }).success,
  ).toBe(false);
  expect(
    SectionSchema.safeParse({ ...IFRAME_SECTION, fallback: undefined }).success,
  ).toBe(false);
});

test("the fallback link ALWAYS renders (link mode, and iframe mode pre-upgrade)", () => {
  const { unmount } = render(
    <BookingEmbed
      section={{
        type: "bookingEmbed",
        heading: "Members — book a session",
        mode: "link",
        fallback: { label: "Open The Member Timetable", href: "https://m.example" },
      }}
      globals={globals}
    />,
  );
  expect(
    screen.getByRole("link", { name: /open the member timetable/i }),
  ).toBeDefined();
  unmount();

  // iframe mode: jsdom's matchMedia is absent/false-y — the card must stand alone
  window.matchMedia =
    window.matchMedia ??
    ((q: string) =>
      ({ matches: false, media: q }) as MediaQueryList);
  render(<BookingEmbed section={IFRAME_SECTION} globals={globals} />);
  expect(screen.getByRole("link", { name: /open the calendar/i })).toBeDefined();
  expect(screen.getByRole("heading", { name: /book a discovery call/i })).toBeDefined();
});

test("book.json parses via the page pipeline and repointed CTAs land on /book", () => {
  const book = loadPage("book");
  expect(book.sections.some((s) => s.type === "bookingEmbed")).toBe(true);
  const home = loadPage("home");
  const banner = home.sections.find((s) => s.type === "ctaBanner");
  expect(banner && "cta" in banner && banner.cta?.href).toBe("/book");
});
