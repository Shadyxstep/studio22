"use client";

import { useEffect, useRef } from "react";

/*
 * Page-wide ambience, all opt-in from JS so the server HTML is static:
 * - marks the V2 root with data-v2-js (mobile menu toggle) and, when the
 *   browser can animate a registered @property, data-v2-prop (border light);
 * - adds data-v2-ready once the page has loaded and gone idle: the ambient
 *   loops (border light, hero glow and dust, background drift) only start
 *   then, so they never compete with the first paint or the hero image;
 * - pauses the loops inside [data-v2-loop] elements while they're off screen;
 * - moves the cursor glow (fine pointers only, never under reduced motion).
 */
export function Ambient() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = glow.current?.closest<HTMLElement>(".v2");
    if (!root) return;
    root.dataset.v2Js = "";
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (typeof CSS !== "undefined" && "registerProperty" in CSS && !reduced) root.dataset.v2Prop = "";

    const cleanups: Array<() => void> = [];

    if (!reduced) {
      const ready = () => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
        idle(() => (root.dataset.v2Ready = ""));
      };
      if (document.readyState === "complete") ready();
      else {
        window.addEventListener("load", ready, { once: true });
        cleanups.push(() => window.removeEventListener("load", ready));
      }
    }

    if (!reduced && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) delete el.dataset.paused;
          else el.dataset.paused = "";
        }
      });
      root.querySelectorAll("[data-v2-loop]").forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    const el = glow.current;
    if (el && !reduced && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) {
      let x = -2000;
      let y = -2000;
      let queued = false;
      const move = (e: PointerEvent) => {
        x = e.clientX;
        y = e.clientY;
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y}px)`;
          queued = false;
        });
      };
      const leave = () => (el.style.transform = "translate(-2000px, -2000px)");
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
      });
    }

    return () => {
      cleanups.forEach((c) => c());
      delete root.dataset.v2Js;
      delete root.dataset.v2Prop;
      delete root.dataset.v2Ready;
    };
  }, []);

  return <div ref={glow} className="v2-cursor" aria-hidden />;
}
