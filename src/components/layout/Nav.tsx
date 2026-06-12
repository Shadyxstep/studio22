"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Site } from "@/lib/content/schema";
import { ThemeToggle } from "./ThemeToggle";

export function Nav({ site }: { site: Site }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-line bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label={site.name}
        className={`mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 transition-all duration-300 ${
          solid ? "py-3.5" : "py-6"
        }`}
      >
        <Link
          href="/"
          className="font-display text-xl font-semibold uppercase tracking-[0.14em] text-bone"
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
                  className={`text-[13px] tracking-[0.05em] transition-colors duration-300 hover:text-bone ${
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
                className={`block py-3 font-display text-lg ${
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
