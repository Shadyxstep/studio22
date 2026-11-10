import Image from "next/image";
import { Reveal } from "./Reveal";

type Card = {
  title: string;
  /** TODO(owner) where empty. */
  description: string;
  image: { src: string; alt: string } | null;
  href: string;
};

/* No V1 page has per-discipline sections, so cards link to the page that
   sells (packages) or shows (facility) each one. */
const CARDS: Card[] = [
  {
    title: "Strength",
    description: "Build real strength. Move with confidence. Feel powerful.",
    image: {
      src: "/images/strength-squat.jpg",
      alt: "An athlete performing a barbell back squat in the Studio 22 gym",
    },
    href: "/packages",
  },
  {
    title: "Golf",
    description: "Train smarter. Hit farther. Play better golf.",
    image: null, // TODO(owner): new golf training photo
    href: "/facility",
  },
  {
    title: "Reformer Pilates",
    description: "No experience needed. We coach you through every movement, step by step.",
    image: {
      src: "/images/pilates-studio.jpg",
      alt: "A member seated on a mat beneath the backlit Pilates at Studio 22 sign",
    },
    href: "/packages",
  },
  {
    title: "Trackman Simulator",
    description: "", // TODO(owner): Trackman one-liner
    image: {
      src: "/images/golf-simulator.jpg",
      alt: "A golfer addressing the ball in the Studio 22 golf simulator",
    },
    href: "/facility",
  },
];

export function Offering() {
  return (
    <section id="offering" className="v2-section" aria-labelledby="v2-offering-title">
      <div className="v2-container">
        <div className="v2-head">
          <div className="v2-head__titles">
            <p className="v2-label">
              <span>0.1</span>Our Offering
            </p>
            <h2 id="v2-offering-title" className="v2-h2">
              Four ways to train at Studio 22
            </h2>
          </div>
          <p className="v2-head__note">Performance is the greatest motivator.</p>
        </div>
        <ul className="v2-list v2-grid v2-grid--four">
          {CARDS.map((c, i) => (
            <li key={c.title}>
              <Reveal index={i} className="v2-fill">
                <a href={c.href} className="v2-card-link">
                  <div className="v2-card-link__media">
                    <span className="v2-badge" aria-hidden>
                      {i + 1}
                    </span>
                    {c.image && (
                      <Image
                        src={c.image.src}
                        alt={c.image.alt}
                        fill
                        sizes="(max-width: 560px) 90vw, (max-width: 1100px) 45vw, 300px"
                      />
                    )}
                  </div>
                  <div className="v2-card-link__body">
                    <h3 className="v2-card-link__title">{c.title}</h3>
                    {c.description && <p className="v2-card-link__desc">{c.description}</p>}
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
