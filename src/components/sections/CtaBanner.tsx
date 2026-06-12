import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "ctaBanner" }>;
  globals: Globals;
};

export function CtaBanner({ section }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="flex flex-col items-center gap-6 rounded-card bg-slate px-8 py-20 text-center md:py-24">
        {section.headline && (
          <h2 className="max-w-3xl font-display text-4xl leading-tight text-bone md:text-6xl">
            {section.headline}
          </h2>
        )}
        {section.body && (
          <p className="max-w-xl text-sm leading-7 text-mid">{section.body}</p>
        )}
        {section.cta && (
          <Button href={section.cta.href} className="mt-4">
            {section.cta.label}
          </Button>
        )}
      </Reveal>
    </section>
  );
}
