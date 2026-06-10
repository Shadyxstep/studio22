import Image from "next/image";
import { HeroFade, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = { section: Extract<Section, { type: "hero" }>; globals: Globals };

export function Hero({ section }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {section.image && (
        <HeroFade className="absolute inset-0">
          <Image
            src={section.image.src}
            alt={section.image.alt}
            fill
            priority
            sizes="100vw"
            className="photo-hero object-cover"
          />
          <div className="scrim-hero absolute inset-0" />
        </HeroFade>
      )}
      <Reveal className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-end gap-6 px-6 pb-20 pt-32">
        {section.label && <SectionLabel>{section.label}</SectionLabel>}
        <h1 className="max-w-4xl font-display text-5xl leading-[1.05] text-bone md:text-7xl">
          {section.headline}
        </h1>
        {section.sub && (
          <p className="max-w-xl text-base leading-relaxed text-mid">
            {section.sub}
          </p>
        )}
        {section.ctas && section.ctas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
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
    </section>
  );
}
