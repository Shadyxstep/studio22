import { RevealItem, RevealStagger } from "@/components/motion";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "statBar" }>;
  globals: Globals;
};

export function StatBar({ section }: Props) {
  return (
    <section className="border-y border-line">
      <RevealStagger className="mx-auto grid max-w-6xl gap-px bg-line sm:auto-cols-fr sm:grid-flow-col">
        {section.stats.map((stat) => (
          <RevealItem
            key={stat.label}
            className="flex flex-col items-center gap-2 bg-ink px-6 py-12"
          >
            <p className="font-display text-4xl text-sage md:text-5xl">
              {stat.value}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-mid">
              {stat.label}
            </p>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
