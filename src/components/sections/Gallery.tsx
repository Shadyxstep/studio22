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
      <RevealStagger className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
        {section.images.map((img, i) => (
          <RevealItem
            key={img.src + i}
            className={`relative bg-ink ${i % 5 === 0 ? "col-span-2" : ""}`}
          >
            <div
              className={`relative ${i % 5 === 0 ? "aspect-[2/1]" : "aspect-[4/5]"}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-80 transition-opacity duration-500 hover:opacity-100"
              />
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
