import type { V2Home } from "@/lib/content/schema";
import { Label } from "./Label";
import { Reveal } from "./Reveal";
import { V2Img } from "./V2Img";
import { Widget } from "./Widget";

/* Border-light start offsets, so the four lights never move in step. */
const EDGE_DELAYS = ["0s", "-3.5s", "-7s", "-10.5s"];

export function Offering({ n, offering }: { n: number; offering: V2Home["offering"] }) {
  return (
    <section id="offering" className="v2-section" aria-labelledby="v2-offering-title">
      <div className="v2-container">
        <div className="v2-head">
          <Reveal>
            <Label n={n}>{offering.label}</Label>
            <h2 id="v2-offering-title" className="v2-h2">
              {offering.heading}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="v2-head__note">{offering.note}</p>
          </Reveal>
        </div>
        <ul className="v2-offer">
          {offering.cards.map((c, i) => (
            <li key={c.title}>
              <Reveal index={i} className="v2-fill">
                <a
                  href={c.href}
                  className="v2-ocard v2-edge"
                  style={{ ["--d" as string]: EDGE_DELAYS[i % EDGE_DELAYS.length] }}
                >
                  <article className="v2-ocard__inner">
                    <div className="v2-ocard__top">
                      <b>{String(i + 1).padStart(2, "0")}</b>
                      <span>{c.tag}</span>
                    </div>
                    <div className="v2-media v2-r45">
                      <V2Img
                        image={c.image}
                        sizes="(max-width: 639px) min(480px, 90vw), (max-width: 1099px) 45vw, 290px"
                      />
                    </div>
                    <h3>{c.title}</h3>
                    <p className="v2-ocard__desc">{c.description}</p>
                    <Widget widget={c.widget} />
                    <div className="v2-ocard__foot">
                      {c.linkLabel} <span aria-hidden>→</span>
                    </div>
                  </article>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
