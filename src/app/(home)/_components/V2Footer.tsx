import type { V2Home } from "@/lib/content/schema";

/** Footer links, minus FAQs while content/faqs.json has no entries. */
export function footerLinks(links: V2Home["footer"]["links"], faqCount: number) {
  return faqCount > 0 ? links : links.filter((l) => l.href !== "/faqs");
}

export function V2Footer({
  name,
  footer,
  faqCount,
  credit,
}: {
  name: string;
  footer: V2Home["footer"];
  faqCount: number;
  credit?: { label: string; href: string };
}) {
  return (
    <footer className="v2-footer" data-v2-footer>
      <div className="v2-container v2-footer__row">
        <a href="#top" className="v2-footer__mark">
          {name.toUpperCase()}
        </a>
        <nav aria-label={footer.linksLabel}>
          <ul className="v2-footer__links">
            {footerLinks(footer.links, faqCount).map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="v2-footer__meta">
          <p className="v2-footer__copy">{footer.copyright}</p>
          {credit && (
            <p className="v2-footer__copy">
              <a href={credit.href} target="_blank" rel="noopener" className="v2-footer__credit">
                {credit.label}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
