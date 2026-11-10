const LINKS = [
  { label: "Our Facility", href: "/facility" },
  { label: "Packages", href: "/packages" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

export function V2Footer({ name }: { name: string }) {
  return (
    <footer className="v2-footer" data-v2-footer>
      <div className="v2-container v2-footer__row">
        <div className="v2-footer__mark">{name.toUpperCase()}</div>
        <ul className="v2-footer__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div>© 2026 {name}</div>
      </div>
    </footer>
  );
}
