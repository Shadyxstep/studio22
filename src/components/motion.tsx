"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  heroFade,
  resolveVariants,
  reveal,
  revealStagger,
  viewportOnce,
} from "@/lib/motion";

/*
 * Client wrappers for the SPEC §8.4 presets. These wire lib/motion.ts to
 * framer-motion and the user's reduced-motion preference — they define no
 * animation values of their own.
 */

type Props = { children: ReactNode; className?: string };

export function Reveal({ children, className }: Props) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={resolveVariants(reveal, reduced)}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({ children, className }: Props) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={resolveVariants(revealStagger, reduced)}
    >
      {children}
    </motion.div>
  );
}

/** Child of RevealStagger — staggered `reveal`. */
export function RevealItem({ children, className }: Props) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div className={className} variants={resolveVariants(reveal, reduced)}>
      {children}
    </motion.div>
  );
}

/** Page-load fade for hero media. */
export function HeroFade({ children, className }: Props) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={resolveVariants(heroFade, reduced)}
    >
      {children}
    </motion.div>
  );
}
