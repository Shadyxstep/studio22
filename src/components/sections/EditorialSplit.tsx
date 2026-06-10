import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "editorialSplit" }>;
  globals: Globals;
};

export function EditorialSplit({ section }: Props) {
  const text = (
    <div className="flex flex-col items-start gap-6">
      {section.label && <SectionLabel>{section.label}</SectionLabel>}
      <h2 className="max-w-xl font-display text-3xl leading-snug text-bone md:text-5xl">
        {section.headline}
      </h2>
      {section.bullets && section.bullets.length > 0 && (
        <ul className="flex flex-col gap-3">
          {section.bullets.map((b) => (
            <li
              key={b}
              className="border-l border-sage pl-4 text-sm leading-relaxed text-bone"
            >
              {b}
            </li>
          ))}
        </ul>
      )}
      {section.paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className="max-w-xl text-sm leading-7 text-mid">
          {p}
        </p>
      ))}
      {section.cta && (
        <Button href={section.cta.href} variant="outline" className="mt-2">
          {section.cta.label}
        </Button>
      )}
    </div>
  );

  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto max-w-6xl px-6 py-24">
        {section.image ? (
          <div
            className={`grid items-center gap-12 md:grid-cols-2 ${
              section.reverse ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={section.image.src}
                alt={section.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {text}
          </div>
        ) : (
          text
        )}
      </Reveal>
    </section>
  );
}
