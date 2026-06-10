"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Site } from "@/lib/content/schema";
import { ThemeToggle } from "./ThemeToggle";

export function Nav({ site }: { site: Site }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
      <nav
        aria-label={site.name}
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
      >
        <Link
          href="/"
          className="font-display text-lg tracking-[0.18em] text-bone uppercase"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:text-sage ${
                    pathname === item.href ? "text-sage" : "text-mid"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={site.name}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-bone transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-bone transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-nav" className="border-t border-line px-6 pb-6 md:hidden">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-xs font-medium uppercase tracking-[0.2em] ${
                  pathname === item.href ? "text-sage" : "text-bone"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
