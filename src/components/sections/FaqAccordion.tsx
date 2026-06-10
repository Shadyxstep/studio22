import type { Globals } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";
import { Reveal } from "@/components/motion";
import { buildMailto } from "@/lib/mailto";

type Props = {
  section: Extract<Section, { type: "faqAccordion" }>;
  globals: Globals;
};

export function FaqAccordion({ section, globals }: Props) {
  const mailto = buildMailto(
    globals.site.contact.email,
    globals.site.contact.mailtoSubject,
  );
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      {section.heading && (
        <h2 className="mb-14 font-display text-4xl text-bone md:text-5xl">
          {section.heading}
        </h2>
      )}
      {globals.faqs.length > 0 ? (
        <Reveal className="flex flex-col border-t border-line">
          {globals.faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-line">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left font-display text-lg text-bone transition-colors duration-300 hover:text-sage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage">
                {faq.question}
                <span
                  aria-hidden
                  className="text-sage transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-8 text-sm leading-7 text-mid">{faq.answer}</p>
            </details>
          ))}
        </Reveal>
      ) : (
        /* Empty state pending owner FAQ copy — surfaces the contact email. */
        <Reveal className="border border-line px-8 py-14 text-center">
          <a
            href={mailto}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-sage underline-offset-8 transition-colors duration-300 hover:underline"
          >
            {globals.site.contact.email}
          </a>
        </Reveal>
      )}
    </section>
  );
}
