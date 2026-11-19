import Link from "next/link";
import type { GiftVouchers as GiftVouchersContent } from "@/lib/content/schema";
import { cta } from "../_lib/track";
import { GIFT_VOUCHERS_PATH, groupPrice } from "../_lib/vouchers";
import { Label } from "./Label";
import { Reveal } from "./Reveal";
import { V2Img } from "./V2Img";

const EDGE_DELAYS = ["0s", "-4.6s", "-9.3s"];

/* Homepage section: one tile per kind of voucher, each linking to its group
   on the gift vouchers page. */
export function GiftVouchers({ n, content }: { n: number; content: GiftVouchersContent }) {
  const { home, groups } = content;
  return (
    <section id="gift-vouchers" className="v2-section" aria-labelledby="v2-gift-title" data-v2-loop>
      <div className="v2-breathe" aria-hidden />
      <div className="v2-container v2-gv">
        <Reveal className="v2-gv__aside">
          <Label n={n}>{home.label}</Label>
          <h2 id="v2-gift-title" className="v2-h2">
            {home.heading}
          </h2>
          <p className="v2-body">{home.body}</p>
          <Link href={home.cta.href} className="v2-btn v2-btn--accent" {...cta("gift_vouchers", "gift_section")}>
            {home.cta.label}
          </Link>
        </Reveal>
        <ul className="v2-gv__cats">
          {groups.map((g, i) => (
            <li key={g.id}>
              <Reveal index={i} className="v2-fill">
                <a
                  href={`${GIFT_VOUCHERS_PATH}#${g.id}`}
                  className="v2-gcat v2-edge"
                  style={{ ["--d" as string]: EDGE_DELAYS[i % EDGE_DELAYS.length] }}
                  {...cta(`gift_vouchers_${g.id.replace(/-/g, "_")}`, "gift_section")}
                >
                  <div className="v2-media v2-gcat__media">
                    <V2Img image={g.vouchers[0].image} sizes="(min-width: 760px) 30vw, 120px" />
                  </div>
                  <div className="v2-gcat__body">
                    <h3>{g.label}</h3>
                    <p>{groupPrice(home.from, g)}</p>
                  </div>
                  <span className="v2-gcat__arrow" aria-hidden>
                    →
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
