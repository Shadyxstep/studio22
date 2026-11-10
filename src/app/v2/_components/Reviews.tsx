import type { Site, Testimonial } from "@/lib/content/schema";
import { cta } from "../_lib/track";
import { Reveal } from "./Reveal";

export function Reviews({ reviews, site }: { reviews: Testimonial[]; site: Site }) {
  return (
    <section id="reviews" className="v2-section v2-reviews" aria-labelledby="v2-reviews-title">
      <div className="v2-container v2-split v2-reviews__inner">
        <div className="v2-split__aside">
          <p className="v2-label">
            <span>0.4</span>Reviews
          </p>
          <h2 id="v2-reviews-title" className="v2-h2">
            Trusted by our community
          </h2>
          <a
            href={site.reviewCta.href}
            className="v2-text-link"
            {...cta("leave_review", "reviews")}
          >
            Leave us a Google review
          </a>
        </div>
        {/* phones: horizontal scroll-snap row — focusable so keyboards can scroll it */}
        <ul
          className="v2-list v2-grid v2-split__main v2-reviews__row"
          tabIndex={0}
          aria-label="Google reviews"
        >
          {reviews.map((r, i) => (
            <li key={r.name}>
              <Reveal index={i} className="v2-fill">
                <figure className="v2-card">
                  <blockquote className="v2-review__quote">{r.quote}</blockquote>
                  <figcaption className="v2-review__by">
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
