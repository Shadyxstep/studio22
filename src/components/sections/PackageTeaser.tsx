import { RevealItem, RevealStagger } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";
import { PackageCard } from "./PackageCard";

type Props = {
  section: Extract<Section, { type: "packageTeaser" }>;
  globals: Globals;
};

export function PackageTeaser({ section, globals }: Props) {
  const pkgs = globals.packages.slice(0, section.limit ?? 3);
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {(section.heading || section.tagline) && (
          <div className="mb-12 flex flex-col gap-4">
            {section.tagline && <SectionLabel>{section.tagline}</SectionLabel>}
            {section.heading && (
              <h2 className="font-display text-4xl text-bone md:text-5xl">
                {section.heading}
              </h2>
            )}
          </div>
        )}
        <RevealStagger className="grid gap-px border border-line bg-line md:grid-cols-3">
          {pkgs.map((pkg) => (
            <RevealItem key={pkg.id} className="flex">
              <PackageCard pkg={pkg} globals={globals} />
            </RevealItem>
          ))}
        </RevealStagger>
        {section.cta && (
          <div className="mt-12 flex justify-center">
            <Button href={section.cta.href}>{section.cta.label}</Button>
          </div>
        )}
      </div>
    </section>
  );
}
