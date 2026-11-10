"use client";

import { useEffect } from "react";
import { pushCta } from "../_lib/track";

export function CtaTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-cta-id]");
      if (!el) return;
      pushCta(el.dataset.ctaId ?? "", el.dataset.ctaLocation ?? "");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
