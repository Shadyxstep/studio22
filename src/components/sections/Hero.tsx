import Image from "next/image";
import type { ReactNode } from "react";
import { HeroFade, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Globals } from "@/lib/content/load";
import { imageFocusClass, type Section } from "@/lib/content/schema";

type Props = { section: Extract<Section, { type: "hero" }>; globals: Globals };

/* Style-only treatment: the last word of the headline renders in italic sage. */
function accentLastWord(headline: string): ReactNode {
  const words = headline.trim().split(" ");
  if (words.length < 2) return headline;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <em className="italic text-sage">{last}</em>
    </>
  );
}

export function Hero({ section }: Props) {
  return (
    <section className="overflow-hidden">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 md:gap-14 md:pb-20 md:pt-24 ${
          section.image ? "md:grid-cols-[0.95fr_1.05fr]" : ""
        }`}
      >
        <Reveal className="flex flex-col items-start gap-6">
          {section.label && <SectionLabel>{section.label}</SectionLabel>}
          <h1 className="font-display text-5xl leading-[1.08] text-bone md:text-6xl lg:text-7xl">
            {accentLastWord(section.headline)}
          </h1>
          {section.sub && (
            <p className="max-w-xl text-base leading-relaxed text-mid">
              {section.sub}
            </p>
          )}
          {section.ctas && section.ctas.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {section.ctas.map((cta, i) => (
                <Button
                  key={cta.href}
                  href={cta.href}
                  variant={i === 0 ? "solid" : "outline"}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          )}
        </Reveal>
        {section.image && (
          <HeroFade className="relative aspect-[4/3] overflow-hidden rounded-card shadow-[0_30px_60px_-30px_var(--color-line)]">
            <Image
              src={section.image.src}
              alt={section.image.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className={`object-cover ${imageFocusClass(section.image.focus)}`}
            />
          </HeroFade>
        )}
      </div>
    </section>
  );
}
