"use client";

import { useEffect, useState } from "react";
import { cta } from "../_lib/track";

/* Pill sits 20px above the bottom edge; this is the band it occupies. */
const PILL_BOTTOM = 20;
const PILL_HEIGHT = 58;
const PHONE = "(max-width: 759px)";

/*
 * Fixed booking pill. Shown only once the hero has scrolled away, and hidden
 * again while the packages section, the light Visit section or the footer is
 * on screen. On phones it is also hidden whenever a link or button on the
 * page passes underneath it, so it never covers something tappable.
 * Hidden = inert.
 */
export function StickyPill({ href, label, button }: { href: string; label: string; button: string }) {
  const [blockedBySection, setBlockedBySection] = useState(true);
  const [blockedByTarget, setBlockedByTarget] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = ["[data-v2-hero]", "#packages", "[data-v2-visit]", "[data-v2-footer]"]
      .map((s) => document.querySelector(s))
      .filter((el): el is Element => el !== null);
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setBlockedBySection(onScreen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !window.matchMedia) return;
    const phone = window.matchMedia(PHONE);
    let io: IntersectionObserver | null = null;

    const watch = () => {
      io?.disconnect();
      io = null;
      setBlockedByTarget(false);
      if (!phone.matches) return;
      // observe only the horizontal band the pill covers
      const top = window.innerHeight - PILL_BOTTOM - PILL_HEIGHT;
      const under = new Set<Element>();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) under.add(e.target);
            else under.delete(e.target);
          }
          setBlockedByTarget(under.size > 0);
        },
        { rootMargin: `-${top}px 0px -${PILL_BOTTOM}px 0px` },
      );
      document
        .querySelectorAll(".v2 main a, .v2 main button, .v2 main [tabindex]")
        .forEach((el) => el.classList.contains("v2-pill") || io!.observe(el));
    };

    watch();
    phone.addEventListener("change", watch);
    window.addEventListener("resize", watch);
    return () => {
      io?.disconnect();
      phone.removeEventListener("change", watch);
      window.removeEventListener("resize", watch);
    };
  }, []);

  const hidden = blockedBySection || blockedByTarget;
  return (
    <a
      href={href}
      className="v2-pill"
      data-hidden={hidden}
      inert={hidden}
      aria-label={`${label}. ${button}`}
      {...cta("book_trial", "sticky_pill")}
    >
      {label}
      <span className="v2-pill__btn">{button}</span>
    </a>
  );
}
