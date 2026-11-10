import type { Package, Site } from "@/lib/content/schema";
import { getPackageCta } from "@/lib/packages";
import { V2_CONFIG } from "../_lib/config";
import { ctaIdFor, priceParts, shortName } from "../_lib/packages";
import { cta } from "../_lib/track";
import { Reveal } from "./Reveal";

export function Packages({ packages, site }: { packages: Package[]; site: Site }) {
  return (
    <section id="packages" className="v2-section" aria-labelledby="v2-packages-title">
      <div className="v2-container v2-split">
        <div className="v2-split__aside">
          <p className="v2-label">
            <span>0.3</span>Our Packages
          </p>
          <h2 id="v2-packages-title" className="v2-h2">
            Pick how you train
          </h2>
          <p className="v2-split__note">
            Every membership includes the on-site sauna for recovery after your session.
          </p>
        </div>
        <ul className="v2-list v2-grid v2-split__main">
          {packages.map((pkg, i) => {
            const highlighted = pkg.id === V2_CONFIG.highlightedPackageId;
            const { amount, per } = priceParts(pkg);
            const link = getPackageCta(pkg, site);
            return (
              <li key={pkg.id}>
                <Reveal index={i} className="v2-fill">
                  <article className={`v2-card ${highlighted ? "v2-card--highlight" : ""}`}>
                    <h3 className="v2-pkg__name">{shortName(pkg.name)}</h3>
                    <p className="v2-pkg__price">
                      {amount}
                      <span className="v2-pkg__per">{per}</span>
                    </p>
                    <ul className="v2-pkg__list">
                      {pkg.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <a
                      href={link.href}
                      className={`v2-btn v2-pkg__cta ${highlighted ? "v2-btn--accent" : "v2-btn--outline"}`}
                      aria-label={`${link.label}: ${shortName(pkg.name)}`}
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
      </div>
    </section>
  );
}
