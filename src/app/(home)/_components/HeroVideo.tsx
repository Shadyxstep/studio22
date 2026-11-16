"use client";

import { useEffect, useRef } from "react";

/* Muted loop over the poster image; stays paused on the poster under
   prefers-reduced-motion. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {}); // autoplay refused: the poster stays
  }, []);
  return (
    <video
      ref={ref}
      className="v2-hero__video"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
