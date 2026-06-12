import Image from "next/image";
import { RevealItem, RevealStagger } from "@/components/motion";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "gallery" }>;
  globals: Globals;
};

/* Editorial rhythm: every 5th image spans wide. Tolerates any image count. */
export function Gallery({ section }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {section.heading && (
        <h2 className="mb-14 font-display text-4xl text-bone md:text-5xl">
          {section.heading}
        </h2>
      )}
      <RevealStagger className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {section.images.map((img, i) => (
          <RevealItem
            key={img.src + i}
            className={`group relative ${i % 5 === 0 ? "col-span-2" : ""}`}
          >
            <div
              className={`relative overflow-hidden rounded-card ${i % 5 === 0 ? "aspect-[2/1]" : "aspect-[4/5]"}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
              />
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
