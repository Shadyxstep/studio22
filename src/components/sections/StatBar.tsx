import { RevealItem, RevealStagger } from "@/components/motion";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "statBar" }>;
  globals: Globals;
};

export function StatBar({ section }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <RevealStagger className="grid gap-7 rounded-card bg-slate px-7 py-9 sm:auto-cols-fr sm:grid-flow-col sm:gap-0 sm:px-3">
        {section.stats.map((stat) => (
          <RevealItem
            key={stat.label}
            className="flex flex-col gap-2 border-line sm:border-l sm:px-7 sm:first:border-l-0"
          >
            <p className="font-display text-4xl leading-none text-sage">
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
