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
      <RevealStagger className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {section.pillars.map((key, i) => {
          const pillar = globals.site.pillars[key];
          if (!pillar) return null;
          return (
            <RevealItem key={key} className="group relative bg-ink">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={pillar.image.src}
                  alt={pillar.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                  <p className="font-display text-sm text-sage">
                    {String(i + 1).padStart(2, "0")}.
                  </p>
                  <h3 className="font-display text-2xl text-bone">
                    {pillar.label}
                  </h3>
                  <p className="text-xs leading-relaxed text-mid">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealStagger>
    </section>
  );
}
