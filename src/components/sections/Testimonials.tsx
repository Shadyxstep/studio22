import { RevealItem, RevealStagger } from "@/components/motion";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "testimonials" }>;
  globals: Globals;
};

export function Testimonials({ section, globals }: Props) {
  const items = globals.testimonials.slice(
    0,
    section.limit ?? globals.testimonials.length,
  );
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {section.heading && (
          <h2 className="font-display text-4xl text-bone md:text-5xl">
            {section.heading}
          </h2>
        )}
        {section.sub && (
          <p className="mt-4 max-w-xl text-sm leading-7 text-mid">
            {section.sub}
          </p>
        )}
        <RevealStagger className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <RevealItem key={t.name} className="flex">
              <figure className="flex flex-col gap-6 bg-ink p-8">
                <span
                  aria-hidden
                  className="font-display text-5xl leading-none text-sage"
                >
                  “
                </span>
                <blockquote className="text-sm leading-7 text-bone">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto">
                  <p className="font-display text-base text-bone">{t.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-mid">
                    {t.attribution}
                  </p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>
        <div className="mt-12 flex justify-center">
          <a
            href={globals.site.reviewCta.href}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-sage underline-offset-8 transition-colors duration-300 hover:text-bone hover:underline"
          >
            {globals.site.reviewCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
