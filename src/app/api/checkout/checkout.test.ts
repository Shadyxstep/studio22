import { describe, expect, test } from "vitest";
import { POST as checkout } from "./route";
import { POST as webhook } from "../webhooks/stripe/route";
import { NotConfiguredError, paymentsConfigured } from "@/lib/stripe";

function post(body: unknown): Request {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("dormant checkout (no env configured — SPEC: empty .env suffices)", () => {
  test("payments are not configured in the test environment", () => {
    expect(paymentsConfigured()).toBe(false);
    expect(() => {
      throw new NotConfiguredError();
    }).toThrow(/STUDIO22_PAYMENTS/);
  });

  test("invalid JSON body → 400 envelope", async () => {
    const res = await checkout(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        body: "not json",
      }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_json" });
  });

  test("zod-rejected body → 400 envelope", async () => {
    const res = await checkout(post({ wrong: "shape" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_body" });
  });

  test("unknown package → 404 envelope", async () => {
    const res = await checkout(post({ packageId: "does-not-exist" }));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ ok: false, error: "unknown_package" });
  });

  test("valid request while unconfigured → 501 envelope (the dormancy gate)", async () => {
    const res = await checkout(post({ packageId: "unlimited-gym" }));
    expect(res.status).toBe(501);
    expect(await res.json()).toEqual({
      ok: false,
      error: "payments_not_configured",
    });
  });

  test("webhook stub → 501 not-configured envelope", async () => {
    const res = await webhook();
    expect(res.status).toBe(501);
    expect(await res.json()).toEqual({
      ok: false,
      error: "payments_not_configured",
    });
  });
});
