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

/*
 * V2 homepage ambient presets (owner-directed 2026-11-13, see TASK_LOG).
 * V2 animates in CSS (src/app/v2/v2.css) to keep its JS small, so these are
 * timings, not Framer variants: the V2 layout exposes them as CSS custom
 * properties and the keyframes read them. SPEC §8.4's "no looping" rule is
 * waived for /v2 only; every loop here is slow, low-contrast, paused when
 * off screen and switched off under prefers-reduced-motion (in v2.css).
 */
export const v2Motion = {
  /** Scroll reveal: fade + 24px rise, once. */
  revealMs: 750,
  /** Delay between cards in a group. */
  staggerMs: 80,
  /** One lap of the light travelling round a card border. */
  edgeLapS: 14,
  /** Background colour fields drifting behind the page (three layers). */
  driftS: [48, 60, 76],
  /** Hero glow swell. */
  glowS: 9,
  /** Hairline that "breathes" along a section's top edge. */
  breatheS: 10,
  /** One full pass of the getting-started timeline. */
  timelineS: 9,
} as const;

/** v2Motion as CSS custom properties for the V2 root element. */
export function v2MotionVars(): Record<`--${string}`, string> {
  const m = v2Motion;
  return {
    "--v2-reveal": `${m.revealMs}ms`,
    "--v2-stagger": `${m.staggerMs}ms`,
    "--v2-edge-lap": `${m.edgeLapS}s`,
    "--v2-drift-1": `${m.driftS[0]}s`,
    "--v2-drift-2": `${m.driftS[1]}s`,
    "--v2-drift-3": `${m.driftS[2]}s`,
    "--v2-glow": `${m.glowS}s`,
    "--v2-breathe": `${m.breatheS}s`,
    "--v2-timeline": `${m.timelineS}s`,
  };
}
