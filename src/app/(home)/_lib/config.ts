/*
 * V2 homepage switches. Copy lives in content/v2-home.json and content comes
 * from content/*.json so V2 never drifts from V1; this file only picks and
 * flags.
 */
export const V2_CONFIG = {
  /** Muted hero loop. TODO(owner): supply an 8–12s clip; poster shows until then. */
  heroVideoSrc: undefined as string | undefined,

  /** Packages shown as cards, in order (ids from content/packages.json). */
  packageIds: ["unlimited-gym", "complete-studio", "strength-trial"],
  /** TODO(owner): confirm which package to highlight. */
  highlightedPackageId: "complete-studio",

  /** Reviews shown, by reviewer name (from content/testimonials.json): all five. */
  reviewNames: ["Sophia Simmonds", "Matias Giannetti", "Lauren Airey", "Shananne Smith", "Richie Power"],

  /** Sticky booking pill. TODO(owner): confirm which offer it promotes. */
  stickyPill: {
    enabled: true,
    packageId: "strength-trial",
  },
} as const;
