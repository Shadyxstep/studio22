import Link from "next/link";
import type { V2Home } from "@/lib/content/schema";
import { cta } from "../_lib/track";
import { Label } from "./Label";
import { Reveal } from "./Reveal";
import { V2Img } from "./V2Img";

export function GettingStarted({ n, content }: { n: number; content: V2Home["gettingStarted"] }) {
  const { timeline } = content;
  return (
    <section id="getting-started" className="v2-section" aria-labelledby="v2-how-title">
      <div className="v2-container v2-how">
        <Reveal className="v2-how__copy">
          <Label n={n}>{content.label}</Label>
          <h2 id="v2-how-title" className="v2-h2">
            {content.heading}
          </h2>
          <p className="v2-body">{content.body}</p>
          <p className="v2-how__small">{content.note}</p>
          <Link
            href={content.cta.href}
            className="v2-btn v2-btn--ghost"
            {...cta("see_how_we_help", "getting_started")}
          >
            {content.cta.label}
          </Link>
        </Reveal>
        <div className="v2-how__right">
          <Reveal className="v2-media v2-r45 v2-how__photo">
            <V2Img
              image={content.image}
              sizes="(min-width: 1100px) 300px, (min-width: 760px) 38vw, min(420px, 90vw)"
            />
          </Reveal>
          <Reveal index={1}>
            <div className="v2-tl v2-edge" data-v2-loop>
              <p className="v2-tl__k">{timeline.heading}</p>
              <div className="v2-tl__wrap">
                <div className="v2-tl__track" aria-hidden>
                  <div className="v2-tl__fill" />
                </div>
                <ol>
                  {timeline.steps.map((s, i) => (
                    <li key={s.when}>
                      <span className={`v2-node v2-node--${i + 1}`} aria-hidden />
                      <b>{s.when}</b>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
