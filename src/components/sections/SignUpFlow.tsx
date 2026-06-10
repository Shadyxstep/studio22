"use client";

import { useState } from "react";
import type { Globals } from "@/lib/content/load";
import { PACKAGE_CATEGORIES } from "@/lib/content/schema";
import { formatPrice } from "@/lib/format";
import { buildEnquiryMailto } from "@/lib/mailto";

/*
 * SPEC §9 sign-up flow: choose a package → enter name/phone → the submit
 * anchor opens a pre-filled mailto. Client-side only; no POST exists.
 * When payments activate, only the final CTA branch changes (getPackageCta).
 */
export function SignUpFlow({ globals }: { globals: Globals }) {
  const { site, packages } = globals;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const selected = packages.find((p) => p.id === selectedId) ?? null;
  const ready = selected !== null && name.trim() !== "" && phone.trim() !== "";
  const href = selected
    ? buildEnquiryMailto({
        to: site.contact.email,
        pkg: selected,
        name: name.trim(),
        phone: phone.trim(),
      })
    : undefined;

  const inputCls =
    "w-full border-0 border-b border-line bg-transparent pb-3 pt-1 text-base text-bone outline-none transition-colors duration-300 placeholder:text-mid focus:border-sage";
  const labelCls =
    "text-[11px] font-medium uppercase tracking-[0.2em] text-mid";

  return (
    <div className="flex flex-col gap-12">
      <p className="max-w-xl text-sm leading-7 text-mid">{site.signup.intro}</p>

      <div className="flex flex-col gap-12">
        {PACKAGE_CATEGORIES.map((category) => {
          const pkgs = packages.filter((p) => p.category === category);
          if (pkgs.length === 0) return null;
          return (
            <div key={category}>
              <h3 className="mb-6 border-b border-line pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
                {site.packageCategories[category]}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pkgs.map((pkg) => {
                  const isSelected = pkg.id === selectedId;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setSelectedId(isSelected ? null : pkg.id)
                      }
                      className={`flex h-full w-full flex-col items-start gap-3 border p-6 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
                        isSelected
                          ? "border-sage bg-slate"
                          : "border-line bg-ink hover:border-mid"
                      }`}
                    >
                      <span className="font-display text-lg leading-snug text-bone">
                        {pkg.name}
                      </span>
                      <span
                        className={`font-display text-xl ${isSelected ? "text-sage" : "text-mid"}`}
                      >
                        {formatPrice(pkg)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <form
        className="grid max-w-2xl gap-10 md:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-name" className={labelCls}>
            {site.signup.nameLabel}
          </label>
          <input
            id="signup-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-phone" className={labelCls}>
            {site.signup.phoneLabel}
          </label>
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
        </div>
        <a
          href={ready ? href : undefined}
          aria-disabled={!ready}
          tabIndex={ready ? 0 : -1}
          className={`inline-flex items-center justify-center border px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage md:col-span-2 md:justify-self-start ${
            ready
              ? "border-sage bg-sage text-ink hover:bg-transparent hover:text-sage"
              : "pointer-events-none border-line text-mid"
          }`}
        >
          {site.signup.submitLabel}
        </a>
      </form>
    </div>
  );
}
