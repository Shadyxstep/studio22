"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { V2Home } from "@/lib/content/schema";
import { cta } from "../_lib/track";

/* Link targets reuse the current routes; Reviews jumps to the reviews
   section on this page. The menu toggle only shows once JS is running. */
export function V2Nav({ name, nav }: { name: string; nav: V2Home["nav"] }) {
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
          {nav.links.map((l) => (
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
          {open ? nav.closeLabel : nav.menuLabel}
        </button>
        <Link href={nav.join.href} className="v2-btn v2-btn--accent v2-nav__join" {...cta("join_now", "nav")}>
          {nav.join.label}
        </Link>
        {open && (
          <ul id="v2-menu" className="v2-nav__menu">
            {nav.links.map((l) => (
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
