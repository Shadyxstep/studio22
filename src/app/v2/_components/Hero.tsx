import Link from "next/link";
import type { Site, V2Home } from "@/lib/content/schema";
import { V2_CONFIG } from "../_lib/config";
import { cta } from "../_lib/track";
import { HeroVideo } from "./HeroVideo";
import { V2Img } from "./V2Img";

export function Hero({ hero, site }: { hero: V2Home["hero"]; site: Site }) {
  const videoSrc = V2_CONFIG.heroVideoSrc;
  return (
    <section id="top" className="v2-hero" data-v2-hero data-v2-loop>
      <div className="v2-hero__media">
        <V2Img image={hero.image} sizes="100vw" className="v2-hero__img" priority />
        {videoSrc && <HeroVideo src={videoSrc} poster={hero.image.src} />}
        <div className="v2-hero__glow" aria-hidden />
        <div className="v2-dustbox" aria-hidden>
          <div className="v2-dust v2-dust--a" />
          <div className="v2-dust v2-dust--b" />
          <div className="v2-dust v2-dust--c" />
        </div>
        <div className="v2-hero__scrim" aria-hidden />
      </div>
      <div className="v2-hero__content">
        <p className="v2-eyebrow">{hero.eyebrow}</p>
        <h1>
          <span>{hero.title}</span>
          <span className="v2-grad">{hero.titleAccent}</span>
        </h1>
        <div className="v2-hero__row">
          <p className="v2-lead">{hero.lead}</p>
          <div className="v2-hero__ctas">
            <Link
              href={hero.primary.href}
              className="v2-btn v2-btn--lg v2-btn--accent"
              {...cta("join_now", "hero")}
            >
              {hero.primary.label}
            </Link>
            <a
              href={site.links.assessment}
              className="v2-btn v2-btn--lg v2-btn--ghost"
              {...cta("more_info", "hero")}
            >
              {hero.secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
