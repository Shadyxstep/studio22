import type { V2Home } from "@/lib/content/schema";
import { Label } from "./Label";
import { Reveal } from "./Reveal";
import { V2Img } from "./V2Img";

/* Bento slots for the five tiles: grid placement and responsive image width. */
const SLOTS = [
  { cls: "v2-f1", sizes: "(min-width: 1024px) 58vw, 100vw", i: 0 },
  { cls: "v2-f2", sizes: "(min-width: 1024px) 42vw, 100vw", i: 1 },
  { cls: "v2-f3", sizes: "(min-width: 1024px) 25vw, 50vw", i: 0 },
  { cls: "v2-f4", sizes: "(min-width: 1024px) 25vw, 50vw", i: 1 },
  { cls: "v2-f5", sizes: "(min-width: 1024px) 50vw, 100vw", i: 2 },
];

export function Facility({ n, facility }: { n: number; facility: V2Home["facility"] }) {
  return (
    <section id="facility" className="v2-section" aria-labelledby="v2-facility-title" data-v2-loop>
      <div className="v2-breathe" aria-hidden />
      <div className="v2-container">
        <div className="v2-fhead">
          <Reveal>
            <Label n={n}>{facility.label}</Label>
            <h2 id="v2-facility-title" className="v2-h2">
              {facility.heading}
            </h2>
          </Reveal>
          <Reveal index={1} className="v2-body">
            {facility.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <a href={facility.link.href} className="v2-tlink">
              {facility.link.label} <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
        <div className="v2-bento">
          {facility.tiles.map((t, k) => {
            const slot = SLOTS[k];
            return (
              <Reveal key={t.image.src} index={slot.i} className={slot.cls}>
                <figure className="v2-tile">
                  <V2Img image={t.image} sizes={slot.sizes} />
                  <figcaption>
                    <b>{t.tag}</b>
                    <span>{t.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
