"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Rise-and-fade on first view. Content is visible by default: the hidden
 * state is only applied from JS, only to elements still below the fold, and
 * only when IntersectionObserver exists — so no-JS, a failed observer or
 * reduced motion all leave everything on screen.
 */
export function Reveal({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Position in a card group; staggers by 0.15s per item. */
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already on screen

    el.dataset.reveal = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // tall elements may never reach 15% — reveal once a decent slice shows
        if (entry.intersectionRatio < 0.15 && entry.intersectionRect.height < 160) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { threshold: [0, 0.15], rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      delete el.dataset.reveal;
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={index ? { transitionDelay: `${index * 0.15}s` } : undefined}
    >
      {children}
    </div>
  );
}
