import type { Site, V2Home } from "@/lib/content/schema";
import { buildMailto } from "@/lib/mailto";
import { formatPhone, shortAddress, telHref } from "../_lib/contact";
import { cta } from "../_lib/track";
import { Label } from "./Label";
import { Reveal } from "./Reveal";

export function Visit({ n, content, site }: { n: number; content: V2Home["visit"]; site: Site }) {
  const { contact } = site;
  return (
    <section id="visit" className="v2-section v2-visit" aria-labelledby="v2-visit-title" data-v2-visit>
      <div className="v2-container v2-vgrid">
        <Reveal>
          <Label n={n}>{content.label}</Label>
          <h2 id="v2-visit-title" className="v2-display">
            {content.heading}
          </h2>
          <a
            href={site.links.booking}
            className="v2-btn v2-btn--lg v2-btn--dark"
            {...cta("book_discovery_call", "visit")}
          >
            {content.ctaLabel}
          </a>
        </Reveal>
        <Reveal index={1} className="v2-vinfo">
          <div>
            <h3>{content.visitHeading}</h3>
            <a href={site.links.map}>{shortAddress(contact.addressParts)}</a>
          </div>
          <div>
            <h3>{content.contactHeading}</h3>
            <a href={telHref(contact.phone)} {...cta("call", "visit")}>
              {formatPhone(contact.phone)}
            </a>
            <a href={buildMailto(contact.email, contact.mailtoSubject)} {...cta("email", "visit")}>
              {contact.email}
            </a>
            <a href={site.links.whatsapp} {...cta("whatsapp", "visit")}>
              {content.whatsappLabel}
            </a>
          </div>
          <div>
            <h3>{content.followHeading}</h3>
            <div className="v2-vinfo__row">
              {site.social.map((s) => (
                <a key={s.href} href={s.href}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
