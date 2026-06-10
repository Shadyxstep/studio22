import type { Variants } from "framer-motion";

/*
 * SPEC §8.4 — the ONLY animation definitions in the app.
 * Components must consume these via src/components/motion.tsx;
 * defining inline animations anywhere else is a Critic violation.
 */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Fade + 24px rise on scroll into view. 0.6s, once. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/** Parent variant of `reveal` — children stagger by 80ms. */
export const revealStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** Opacity + slight scale on page load for hero media. 0.8s. */
export const heroFade: Variants = {
  hidden: { opacity: 0, scale: 1.02 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

const STATIC: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

/**
 * prefers-reduced-motion fallback (SPEC §8.4): when reduced is true the
 * element renders fully visible and static — nothing moves, nothing fades.
 */
export function resolveVariants(variants: Variants, reduced: boolean): Variants {
  return reduced ? STATIC : variants;
}

/** Shared whileInView viewport config: animate once, slightly before entry. */
export const viewportOnce = { once: true, margin: "-64px" } as const;
