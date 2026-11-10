"use client";

import { useEffect, useState } from "react";
import { cta } from "../_lib/track";

/*
 * Fixed booking pill. Shown only once the hero has scrolled away, and hidden
 * again while the packages section or the footer is on screen (so it never
 * sits over the package cards or the footer links). Hidden = inert.
 */
export function StickyPill({ href, label, button }: { href: string; label: string; button: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = ["[data-v2-hero]", "#packages", "[data-v2-footer]"]
      .map((s) => document.querySelector(s))
      .filter((el): el is Element => el !== null);
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setVisible(onScreen.size === 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={href}
      className="v2-pill"
      data-hidden={!visible}
      inert={!visible}
      {...cta("book_trial", "sticky_pill")}
    >
      {label}
      <span className="v2-pill__btn">{button}</span>
    </a>
  );
}
