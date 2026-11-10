import type { Site } from "@/lib/content/schema";
import { buildMailto } from "@/lib/mailto";
import { formatPhone, shortAddress, telHref } from "../_lib/contact";
import { cta } from "../_lib/track";

export function Visit({ site }: { site: Site }) {
  const { contact } = site;
  return (
    <section id="visit" className="v2-section v2-visit" aria-labelledby="v2-visit-title">
      <div className="v2-container v2-visit__grid">
        <div className="v2-visit__main">
          <p className="v2-label">
            <span>0.5</span>Need more information?
          </p>
          <h2 id="v2-visit-title" className="v2-visit__title">
            Book a discovery call and we’ll answer everything.
          </h2>
          <div>
            <a
              href={site.links.booking}
              className="v2-btn v2-btn--lg v2-btn--dark"
              {...cta("book_discovery_call", "visit")}
            >
              Book a discovery call
            </a>
          </div>
        </div>
        <div className="v2-visit__info">
          <div className="v2-visit__group">
            <p className="v2-visit__key">Visit</p>
            <a href={site.links.map}>{shortAddress(contact.addressParts)}</a>
          </div>
          <div className="v2-visit__group">
            <p className="v2-visit__key">Call or email</p>
            <a href={telHref(contact.phone)} {...cta("call", "visit")}>
              {formatPhone(contact.phone)}
            </a>
            <a href={buildMailto(contact.email, contact.mailtoSubject)} {...cta("email", "visit")}>
              {contact.email}
            </a>
          </div>
          <div className="v2-visit__group">
            <p className="v2-visit__key">Follow</p>
            {site.social.map((s) => (
              <a key={s.href} href={s.href}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
