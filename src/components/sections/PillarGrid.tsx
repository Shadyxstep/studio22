import Image from "next/image";
import { RevealItem, RevealStagger } from "@/components/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "pillarGrid" }>;
  globals: Globals;
};

export function PillarGrid({ section, globals }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-32">
      {(section.heading || section.tagline) && (
        <div className="mb-16 flex flex-col gap-4">
          {section.tagline && <SectionLabel>{section.tagline}</SectionLabel>}
          {section.heading && (
            <h2 className="font-display text-4xl text-bone md:text-5xl">
              {section.heading}
            </h2>
          )}
        </div>
      )}
      <RevealStagger className="grid gap-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
        {section.pillars.map((key, i) => {
          const pillar = globals.site.pillars[key];
          if (!pillar) return null;
          return (
            <RevealItem key={key} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image
                  src={pillar.image.src}
                  alt={pillar.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-5 font-display text-base italic text-sage">
                {String(i + 1).padStart(2, "0")}.
              </p>
              <h3 className="mt-1 font-display text-2xl text-bone">
                {pillar.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mid">
                {pillar.description}
              </p>
            </RevealItem>
          );
        })}
      </RevealStagger>
    </section>
  );
}
