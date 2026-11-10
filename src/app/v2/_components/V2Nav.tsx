"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cta } from "../_lib/track";

/* Link targets reuse the current routes; Reviews has no V1 route, so it
   jumps to the reviews section on this page. */
const LINKS = [
  { label: "Our Facility", href: "/facility" },
  { label: "Packages", href: "/packages" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "/contact" },
];

export function V2Nav({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="v2-nav">
      <nav aria-label="Main" className="v2-nav__bar">
        <Link href="/v2" className="v2-nav__mark" onClick={() => setOpen(false)}>
          {name.toUpperCase()}
        </Link>
        <ul className="v2-nav__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="v2-nav__link">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="v2-nav__toggle"
          aria-expanded={open}
          aria-controls="v2-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <Link
          href="/packages"
          className="v2-btn v2-btn--accent v2-nav__join"
          {...cta("join_now", "nav")}
        >
          Join now
        </Link>
        {open && (
          <ul id="v2-menu" className="v2-nav__menu">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="v2-nav__link" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
