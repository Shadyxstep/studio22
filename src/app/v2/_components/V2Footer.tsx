import type { V2Home } from "@/lib/content/schema";

/** Footer links, minus FAQs while content/faqs.json has no entries. */
export function footerLinks(links: V2Home["footer"]["links"], faqCount: number) {
  return faqCount > 0 ? links : links.filter((l) => l.href !== "/faqs");
}

export function V2Footer({
  name,
  footer,
  faqCount,
}: {
  name: string;
  footer: V2Home["footer"];
  faqCount: number;
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
        <p className="v2-footer__copy">{footer.copyright}</p>
      </div>
    </footer>
  );
}
