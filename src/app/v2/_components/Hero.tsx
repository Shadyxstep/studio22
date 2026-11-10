import Image from "next/image";
import Link from "next/link";
import type { Site } from "@/lib/content/schema";
import { V2_CONFIG } from "../_lib/config";
import { cta } from "../_lib/track";
import { HeroVideo } from "./HeroVideo";

const POSTER = "/images/signage-founders.jpg";

export function Hero({ site }: { site: Site }) {
  const videoSrc = V2_CONFIG.heroVideoSrc;
  return (
    <section id="top" className="v2-hero" data-v2-hero>
      <Image
        src={POSTER}
        alt="The Studio 22 founders beneath the backlit Studio 22 sign"
        fill
        priority
        sizes="100vw"
        className="v2-hero__media"
      />
      {videoSrc && <HeroVideo src={videoSrc} poster={POSTER} />}
      <div className="v2-scrim" aria-hidden />
      <div className="v2-container v2-hero__content">
        <p className="v2-hero__eyebrow">Movement. Strength. Recovery. Community.</p>
        <h1 className="v2-hero__title">
          The Future
          <br />
          of Wellness.
        </h1>
        <div className="v2-hero__row">
          <p className="v2-hero__lead">
            Strength, golf, reformer Pilates and recovery under one roof in Dun Laoghaire.
          </p>
          <div className="v2-actions">
            <Link
              href="/packages"
              className="v2-btn v2-btn--lg v2-btn--accent"
              {...cta("join_now", "hero")}
            >
              Join now
            </Link>
            <a
              href={site.links.assessment}
              className="v2-btn v2-btn--lg v2-btn--outline"
              {...cta("more_info", "hero")}
            >
              Want more info?
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
