import { RevealItem, RevealStagger } from "@/components/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Globals } from "@/lib/content/load";
import { PACKAGE_CATEGORIES, type Section } from "@/lib/content/schema";
import { PackageCard } from "./PackageCard";
import { SignUpFlow } from "./SignUpFlow";

type Props = {
  section: Extract<Section, { type: "packageGrid" }>;
  globals: Globals;
};

export function PackageGrid({ section, globals }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {section.heading && (
        <h2 className="mb-16 font-display text-4xl text-bone md:text-5xl">
          {section.heading}
        </h2>
      )}
      {section.selectable ? (
        <SignUpFlow globals={globals} />
      ) : (
        <StaticGrid globals={globals} />
      )}
    </section>
  );
}

function StaticGrid({ globals }: { globals: Globals }) {
  return (
    <>
      <div className="flex flex-col gap-20">
        {PACKAGE_CATEGORIES.map((category) => {
          const pkgs = globals.packages.filter(
            (p) => p.category === category,
          );
          if (pkgs.length === 0) return null;
          return (
            <div key={category}>
              <h3 className="mb-8 border-b border-line pb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
                {globals.site.packageCategories[category]}
              </h3>
              <RevealStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pkgs.map((pkg) => (
                  <RevealItem key={pkg.id} className="flex">
                    <PackageCard pkg={pkg} globals={globals} />
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
          );
        })}
      </div>

      <aside className="mt-20 flex flex-col items-center gap-4 border border-line px-8 py-14 text-center">
        <SectionLabel>{globals.site.sauna.label}</SectionLabel>
        <h3 className="font-display text-3xl text-bone">
          {globals.site.sauna.heading}
        </h3>
        <p className="max-w-xl text-sm leading-7 text-mid">
          {globals.site.sauna.body}
        </p>
      </aside>
    </>
  );
}
