import Image from "next/image";
import Link from "next/link";
import { cta } from "../_lib/track";
import { Reveal } from "./Reveal";

export function Chapter() {
  return (
    <section className="v2-chapter" aria-labelledby="v2-chapter-title">
      <div className="v2-chapter__media">
        <Image
          src="/images/coaches-portrait.jpg"
          alt="Two Studio 22 coaches with kettlebells in the gym"
          fill
          sizes="100vw"
        />
      </div>
      <div className="v2-scrim" aria-hidden />
      <Reveal className="v2-container v2-chapter__content">
        <p className="v2-label">
          <span>0.2</span>Getting started
        </p>
        <h2 id="v2-chapter-title" className="v2-display v2-chapter__title">
          Start today, feel better tomorrow.
        </h2>
        <p className="v2-chapter__text">
          We know walking through the door is the hardest part. You take the first step and
          we’ll meet you where you are.
        </p>
        <div>
          <Link
            href="/get-started"
            className="v2-btn v2-btn--lg v2-btn--outline"
            {...cta("see_how_we_help", "chapter")}
          >
            See how we help you
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
