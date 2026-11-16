import type { Package, Site, V2Home } from "@/lib/content/schema";
import { getPackageCta } from "@/lib/packages";
import { V2_CONFIG } from "../_lib/config";
import { ctaIdFor, priceParts } from "../_lib/packages";
import { cta } from "../_lib/track";
import { Label } from "./Label";
import { Reveal } from "./Reveal";

const EDGE_DELAYS = ["0s", "-4.6s", "-9.3s"];

export type MoreGroup = { heading: string; packages: Package[] };

export function Packages({
  n,
  content,
  packages,
  more,
  site,
}: {
  n: number;
  content: V2Home["packages"];
  packages: Package[];
  more: MoreGroup[];
  site: Site;
}) {
  return (
    <section id="packages" className="v2-section" aria-labelledby="v2-packages-title" data-v2-loop>
      <div className="v2-breathe" aria-hidden />
      <div className="v2-container v2-pk">
        <Reveal className="v2-pk__aside">
          <Label n={n}>{content.label}</Label>
          <h2 id="v2-packages-title" className="v2-h2">
            {content.heading}
          </h2>
          <p className="v2-body">{site.sauna.body}</p>
          <a href={content.link.href} className="v2-tlink">
            {content.link.label} <span aria-hidden>→</span>
          </a>
        </Reveal>
        <div>
          <ul className="v2-pcards">
            {packages.map((pkg, i) => {
              const highlighted = pkg.id === V2_CONFIG.highlightedPackageId;
              const { amount, per } = priceParts(pkg);
              const link = getPackageCta(pkg, site);
              return (
                <li key={pkg.id}>
                  <Reveal index={i} className="v2-fill">
                    <article
                      className={`v2-pcard v2-edge ${highlighted ? "v2-pcard--hi" : ""}`}
                      style={{ ["--d" as string]: EDGE_DELAYS[i % EDGE_DELAYS.length] }}
                    >
                      <h3>{pkg.name}</h3>
                      <p className="v2-price">
                        <strong>{amount}</strong>
                        <span>{per.trim()}</span>
                      </p>
                      <ul className="v2-feats">
                        {pkg.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <a
                        href={link.href}
                        className={`v2-btn ${highlighted ? "v2-btn--accent" : "v2-btn--ghost"}`}
                        aria-label={`${link.label}: ${pkg.name}`}
                        {...cta(ctaIdFor(pkg), "packages")}
                      >
                        {link.label}
                      </a>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          {more.length > 0 && (
            <Reveal className="v2-more">
              {more.map((g) => (
                <div key={g.heading}>
                  <h3>{g.heading}</h3>
                  <ul>
                    {g.packages.map((pkg) => {
                      const { amount, per } = priceParts(pkg);
                      const link = getPackageCta(pkg, site);
                      return (
                        <li key={pkg.id}>
                          <span>{pkg.name}</span>
                          <em>
                            {amount}
                            <small>{per}</small>
                          </em>
                          <a
                            href={link.href}
                            aria-label={`${link.label}: ${pkg.name}`}
                            {...cta(ctaIdFor(pkg), "packages_more")}
                          >
                            {link.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
