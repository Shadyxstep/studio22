import { expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SignUpFlow } from "./SignUpFlow";
import { loadGlobals } from "@/lib/content/load";
import { buildEnquiryMailto } from "@/lib/mailto";

vi.mock("next/navigation", () => ({ usePathname: () => "/get-started" }));

const globals = loadGlobals();

function setup() {
  render(<SignUpFlow globals={globals} />);
  const submit = screen.getByText(globals.site.signup.submitLabel);
  return { submit };
}

test("submit is disabled until a package is selected and fields are filled", () => {
  const { submit } = setup();
  expect(submit.getAttribute("aria-disabled")).toBe("true");
  expect(submit.getAttribute("href")).toBeNull();

  fireEvent.click(
    screen.getByRole("button", { name: /complete studio package/i }),
  );
  expect(submit.getAttribute("aria-disabled")).toBe("true");

  fireEvent.change(screen.getByLabelText(globals.site.signup.nameLabel), {
    target: { value: "Áine O'Brien" },
  });
  fireEvent.change(screen.getByLabelText(globals.site.signup.phoneLabel), {
    target: { value: "+353 87 123 4567" },
  });
  expect(submit.getAttribute("aria-disabled")).toBe("false");
});

test("the submit anchor is the composed enquiry mailto for the selected package", () => {
  const { submit } = setup();
  const pkg = globals.packages.find((p) => p.id === "reformer-10")!;

  fireEvent.click(screen.getByRole("button", { name: new RegExp(pkg.name, "i") }));
  fireEvent.change(screen.getByLabelText(globals.site.signup.nameLabel), {
    target: { value: "Test Person" },
  });
  fireEvent.change(screen.getByLabelText(globals.site.signup.phoneLabel), {
    target: { value: "0871234567" },
  });

  expect(submit.getAttribute("href")).toBe(
    buildEnquiryMailto({
      to: globals.site.contact.email,
      pkg,
      name: "Test Person",
      phone: "0871234567",
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
