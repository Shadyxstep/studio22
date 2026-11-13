import type { Site, Testimonial, V2Home } from "@/lib/content/schema";
import { cta } from "../_lib/track";
import { Label } from "./Label";
import { Reveal } from "./Reveal";

export function Reviews({
  n,
  content,
  reviews,
  site,
}: {
  n: number;
  content: V2Home["reviews"];
  reviews: Testimonial[];
  site: Site;
}) {
  return (
    <section id="reviews" className="v2-section v2-reviews" aria-labelledby="v2-reviews-title">
      <div className="v2-container">
        <div className="v2-rhead">
          <Reveal>
            <Label n={n}>{content.label}</Label>
            <h2 id="v2-reviews-title" className="v2-h2">
              {content.heading}
            </h2>
          </Reveal>
          <Reveal index={1} className="v2-rhead__r">
            <p className="v2-body">{content.body}</p>
            <a href={site.reviewCta.href} className="v2-tlink" {...cta("leave_review", "reviews")}>
              {content.linkLabel} <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
        {/* phones: horizontal scroll-snap row — focusable so keyboards can scroll it */}
        <ul className="v2-rlist" tabIndex={0} aria-label={content.listLabel}>
          {reviews.map((r, i) => (
            <li key={r.name}>
              <Reveal index={i % 3}>
                <figure
                  className="v2-rcard v2-edge"
                  style={{ ["--d" as string]: `${-3.6 * i}s` }}
                >
                  <blockquote>
                    <p>{r.quote}</p>
                  </blockquote>
                  <figcaption>
                    {r.name} · {r.attribution}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
