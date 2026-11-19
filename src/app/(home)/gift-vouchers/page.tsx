import type { Metadata } from "next";
import { loadGiftVouchers, loadSite } from "@/lib/content/load";
import { buildMailto } from "@/lib/mailto";
import { OG_SHARED } from "@/lib/seo";
import { Reveal } from "../_components/Reveal";
import { V2Img } from "../_components/V2Img";
import { cta } from "../_lib/track";
import { GIFT_VOUCHERS_PATH, voucherCtaId } from "../_lib/vouchers";

export function generateMetadata(): Metadata {
  const gv = loadGiftVouchers();
  const site = loadSite();
  const full = `${gv.title} — ${site.name}`;
  return {
    title: gv.title,
    description: gv.description,
    alternates: { canonical: GIFT_VOUCHERS_PATH },
    openGraph: { ...OG_SHARED, siteName: site.name, title: full, description: gv.description, url: GIFT_VOUCHERS_PATH },
    twitter: { card: "summary_large_image", title: full, description: gv.description },
  };
}

const EDGE_DELAYS = ["0s", "-4.6s", "-9.3s"];

export default function GiftVouchersPage() {
  const gv = loadGiftVouchers();
  const { contact } = loadSite();
  return (
    <main id="v2-main" className="v2-page v2-gvp">
      <div className="v2-fields" aria-hidden data-v2-loop>
        <div className="v2-field v2-field--1" />
        <div className="v2-field v2-field--2" />
        <div className="v2-field v2-field--3" />
      </div>
      <section id="top" className="v2-gvp__hero" aria-labelledby="v2-gvp-title">
        <div className="v2-container v2-gvp__intro">
          <div>
            <p className="v2-eyebrow">{gv.hero.eyebrow}</p>
            <h1 id="v2-gvp-title">
              <span>{gv.hero.heading}</span>
              <span className="v2-grad">{gv.hero.headingAccent}</span>
            </h1>
            <p className="v2-lead">{gv.hero.lead}</p>
          </div>
          <ol className="v2-gvp__steps" aria-label={gv.stepsLabel}>
            {gv.steps.map((s, i) => (
              <li key={s.title}>
                <b aria-hidden>{i + 1}</b>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {gv.groups.map((g) => (
        <section key={g.id} id={g.id} className="v2-gvp__group" aria-labelledby={`v2-gvp-${g.id}`}>
          <div className="v2-container v2-gvp__row">
            <h2 id={`v2-gvp-${g.id}`} className="v2-gvp__gtitle">
              {g.label}
            </h2>
            <ul className="v2-gvp__cards">
              {g.vouchers.map((v, i) => (
                <li key={v.id}>
                  <Reveal index={i} className="v2-fill">
                    <article
                      className="v2-gcard v2-edge"
                      style={{ ["--d" as string]: EDGE_DELAYS[i % EDGE_DELAYS.length] }}
                    >
                      <div className="v2-media v2-gcard__media">
                        <V2Img image={v.image} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" />
                      </div>
                      <div className="v2-gcard__body">
                        <h3>{v.name}</h3>
                        <p>{v.description}</p>
                        <div className="v2-gcard__foot">
                          <strong>€{v.price}</strong>
                          <a
                            href={v.purchaseUrl}
                            className="v2-btn v2-btn--accent"
                            aria-label={`${gv.buyLabel}: ${v.name}`}
                            {...cta(voucherCtaId(v), "gift_vouchers")}
                          >
                            {gv.buyLabel} <span aria-hidden>→</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <section className="v2-gvp__notes" aria-label={gv.title}>
        <div className="v2-container v2-gvp__notegrid">
          <div>
            <h2>{gv.notes.expiry.heading}</h2>
            <p>{gv.notes.expiry.body}</p>
          </div>
          <div>
            <h2>{gv.notes.find.heading}</h2>
            <p>
              {gv.notes.find.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
          <div>
            <h2>{gv.notes.questions.heading}</h2>
            <p>
              {gv.notes.questions.body}{" "}
              <a href={buildMailto(contact.email, gv.title)} {...cta("email", "gift_vouchers")}>
                {contact.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
