"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "bookingEmbed" }>;
  globals: Globals;
};

const IFRAME_TIMEOUT_MS = 8000;

/*
 * SPEC §15.7: link-out first. The fallback button ALWAYS renders; when the
 * section asks for an iframe we upgrade progressively — desktop only (long
 * iframes scroll-trap on phones), and only until a load timeout/error, at
 * which point the card stands alone.
 */
export function BookingEmbed({ section }: Props) {
  const [showFrame, setShowFrame] = useState(false);
  const [frameFailed, setFrameFailed] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (section.mode !== "iframe" || !section.src) return;
    // desktop-only progressive enhancement; mobile keeps the link card
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    setShowFrame(true);
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) setFrameFailed(true);
    }, IFRAME_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [section.mode, section.src]);

  const frameActive = showFrame && !frameFailed && Boolean(section.src);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="flex flex-col gap-6 rounded-card bg-slate px-8 py-14">
        <div className="text-center">
          <h2 className="font-display text-3xl leading-tight text-bone md:text-5xl">
            {section.heading}
          </h2>
          {section.body && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mid">
              {section.body}
            </p>
          )}
        </div>
        {frameActive && (
          <iframe
            src={section.src}
            title={section.heading}
            loading="lazy"
            className="h-[70vh] min-h-96 w-full rounded-2xl border border-line bg-bone/5"
            onLoad={() => {
              loadedRef.current = true;
            }}
            onError={() => setFrameFailed(true)}
          />
        )}
        <div className="flex justify-center">
          <Button href={section.fallback.href}>{section.fallback.label}</Button>
        </div>
      </Reveal>
    </section>
  );
}
