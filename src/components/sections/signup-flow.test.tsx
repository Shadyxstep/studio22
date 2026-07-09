import { expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SignUpFlow } from "./SignUpFlow";
import { loadGlobals } from "@/lib/content/load";
import { buildEnquiryMailto } from "@/lib/mailto";
import type { Globals } from "@/lib/content/load";

vi.mock("next/navigation", () => ({ usePathname: () => "/get-started" }));

const globals = loadGlobals();

/* Fixture for the enquiry fallback: strip purchaseUrl so the mailto branch renders. */
const enquiryGlobals: Globals = {
  ...globals,
  packages: globals.packages.map((p) => ({ ...p, purchaseUrl: undefined })),
};

function setup(g: Globals = globals) {
  render(<SignUpFlow globals={g} />);
}

test("CTA is disabled until a package is selected; selecting one with a purchaseUrl enables Buy Now directly", () => {
  setup();
  const cta = screen.getByText(globals.site.signup.submitLabel);
  expect(cta.getAttribute("aria-disabled")).toBe("true");
  expect(cta.getAttribute("href")).toBeNull();

  const pkg = globals.packages.find((p) => p.id === "complete-studio")!;
  fireEvent.click(
    screen.getByRole("button", { name: /complete studio package/i }),
  );
  const buy = screen.getByText(globals.site.purchaseCtaLabel);
  expect(buy.getAttribute("aria-disabled")).toBe("false");
  expect(buy.getAttribute("href")).toBe(pkg.purchaseUrl);
});

test("purchase branch shows no name/phone fields", () => {
  setup();
  fireEvent.click(
    screen.getByRole("button", { name: /strength membership trial/i }),
  );
  expect(screen.queryByLabelText(globals.site.signup.nameLabel)).toBeNull();
  expect(screen.queryByLabelText(globals.site.signup.phoneLabel)).toBeNull();
});

test("packages without a purchaseUrl fall back to the enquiry mailto with name/phone required", () => {
  setup(enquiryGlobals);
  fireEvent.click(
    screen.getByRole("button", { name: /complete studio package/i }),
  );
  const submit = screen.getByText(globals.site.signup.submitLabel);
  expect(submit.getAttribute("aria-disabled")).toBe("true");

  fireEvent.change(screen.getByLabelText(globals.site.signup.nameLabel), {
    target: { value: "Áine O'Brien" },
  });
  fireEvent.change(screen.getByLabelText(globals.site.signup.phoneLabel), {
    target: { value: "+353 87 123 4567" },
  });
  expect(submit.getAttribute("aria-disabled")).toBe("false");

  const pkg = enquiryGlobals.packages.find((p) => p.id === "complete-studio")!;
  expect(submit.getAttribute("href")).toBe(
    buildEnquiryMailto({
      to: globals.site.contact.email,
      pkg,
      name: "Áine O'Brien",
      phone: "+353 87 123 4567",
    }),
  );
});

test("selecting a package marks it pressed; reselecting clears it", () => {
  setup();
  const card = screen.getByRole("button", { name: /pilates membership/i });
  fireEvent.click(card);
  expect(card.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(card);
  expect(card.getAttribute("aria-pressed")).toBe("false");
});

test("every package appears as a selectable card, grouped by category", () => {
  setup();
  for (const pkg of globals.packages) {
    expect(
      screen.getByRole("button", { name: new RegExp(pkg.name, "i") }),
    ).toBeDefined();
  }
  for (const label of Object.values(globals.site.packageCategories)) {
    expect(screen.getByText(label)).toBeDefined();
  }
});
