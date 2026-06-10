import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { buildMailto } from "@/lib/mailto";
import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";

type Props = {
  section: Extract<Section, { type: "contactPanel" }>;
  globals: Globals;
};

export function ContactPanel({ section, globals }: Props) {
  const { contact, links, reviewCta } = globals.site;
  const mailto = buildMailto(contact.email, contact.mailtoSubject);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          {section.heading && (
            <h2 className="font-display text-4xl text-bone md:text-5xl">
              {section.heading}
            </h2>
          )}
          {section.sub && (
            <p className="max-w-md text-sm leading-7 text-mid">{section.sub}</p>
          )}
          <div className="mt-2">
            <Button href={reviewCta.href} variant="outline">
              {reviewCta.label}
            </Button>
          </div>
        </div>

        <ul className="flex flex-col border-t border-line">
          <li className="border-b border-line py-6">
            <a
              href={`tel:${contact.phone}`}
              className="font-display text-xl text-bone transition-colors duration-300 hover:text-sage"
            >
              {contact.phone}
            </a>
          </li>
          <li className="border-b border-line py-6">
            <a
              href={mailto}
              className="font-display text-xl text-bone transition-colors duration-300 hover:text-sage"
            >
              {contact.email}
            </a>
          </li>
          <li className="border-b border-line py-6">
            <a
              href={links.map}
              className="text-sm leading-7 text-mid transition-colors duration-300 hover:text-bone"
            >
              {contact.address}
            </a>
          </li>
          {contact.hours && (
            <li className="border-b border-line py-6">
              <p className="text-sm leading-7 text-mid">{contact.hours}</p>
            </li>
          )}
        </ul>
      </Reveal>
    </section>
  );
}
