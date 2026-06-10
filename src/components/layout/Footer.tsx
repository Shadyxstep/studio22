import Link from "next/link";
import type { Site } from "@/lib/content/schema";

export function Footer({ site }: { site: Site }) {
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(site.contact.mailtoSubject)}`;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
            {site.footer.locationHeading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-mid">
            <a
              href={site.links.map}
              className="transition-colors duration-300 hover:text-bone"
            >
              {site.contact.address}
            </a>
          </p>
          <p className="mt-4 flex flex-col gap-1 text-sm">
            <a
              href={`tel:${site.contact.phone}`}
              className="text-bone transition-colors duration-300 hover:text-sage"
            >
              {site.contact.phone}
            </a>
            <a
              href={mailto}
              className="text-bone transition-colors duration-300 hover:text-sage"
            >
              {site.contact.email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
            {site.footer.socialHeading}
          </h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {site.social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-bone transition-colors duration-300 hover:text-sage"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
            {site.footer.exploreHeading}
          </h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {site.footerLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-bone transition-colors duration-300 hover:text-sage"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-mid">
          {site.copyright}
        </p>
      </div>
    </footer>
  );
}
