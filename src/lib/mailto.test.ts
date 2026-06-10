import { describe, expect, test } from "vitest";
import { buildEnquiryMailto, buildMailto } from "./mailto";

const to = "admin@studio-22.ie";

describe("buildMailto", () => {
  test("encodes spaces as %20, never +", () => {
    const url = buildMailto(to, "I'm Interested In Studio 22");
    expect(url).toBe(
      "mailto:admin@studio-22.ie?subject=I%27m%20Interested%20In%20Studio%2022",
    );
    expect(url).not.toContain("+");
  });
});

describe("buildEnquiryMailto", () => {
  const fields = { to, name: "Áine O'Brien", phone: "+353 87 123 4567" };

  test("weekly package — subject and body composition", () => {
    const url = buildEnquiryMailto({
      ...fields,
      pkg: { name: "Performance Package", price: 75, billing: "weekly" },
    });
    const [, query] = url.split("?");
    const params = new URLSearchParams(query);
    expect(params.get("subject")).toBe("Enquiry — Performance Package");
    expect(params.get("body")).toBe(
      [
        "Package: Performance Package",
        "Price: €75/week",
        "Name: Áine O'Brien",
        "Phone: +353 87 123 4567",
      ].join("\n"),
    );
  });

  test("one-time package — billing renders as One Time Payment", () => {
    const url = buildEnquiryMailto({
      ...fields,
      pkg: {
        name: "10 Reformer Pilates Class Package",
        price: 225,
        billing: "one-time",
      },
    });
    expect(decodeURIComponent(url)).toContain("Price: One Time Payment: €225");
  });

  test("euro sign, newlines and spaces are percent-encoded in the raw url", () => {
    const url = buildEnquiryMailto({
      ...fields,
      pkg: { name: "Pilates Membership", price: 50, billing: "weekly" },
    });
    expect(url).toContain("%E2%82%AC"); // €
    expect(url).toContain("%0A"); // newline
    expect(url).toContain("%20"); // space
    expect(url).not.toContain(" ");
    expect(url).not.toContain("\n");
  });
});
