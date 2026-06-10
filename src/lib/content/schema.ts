import { z } from "zod";

/*
 * SPEC §6.1 constants — the closed vocabularies of the content model.
 * The section registry (T1.5) and the v2 agent are both bounded by these.
 */
export const SECTION_TYPES = [
  "hero",
  "pillarGrid",
  "editorialSplit",
  "statBar",
  "packageGrid",
  "packageTeaser",
  "testimonials",
  "gallery",
  "faqAccordion",
  "ctaBanner",
  "contactPanel",
] as const;

export const PACKAGE_CATEGORIES = ["gym", "pilates", "online-golf"] as const;
export const BILLING = ["weekly", "one-time"] as const;
export const PILLARS = ["gym", "golf", "pilates", "recovery"] as const;

export const PAGE_NAMES = [
  "home",
  "facility",
  "packages",
  "get-started",
  "faqs",
  "contact",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];
export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];
export type Billing = (typeof BILLING)[number];
export type Pillar = (typeof PILLARS)[number];
export type PageName = (typeof PAGE_NAMES)[number];

/* ---------- shared fragments ---------- */

const Cta = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const ImageRef = z.object({
  src: z.string().min(1),
  alt: z.string(),
});

/* ---------- section schemas (SPEC §6.2) ---------- */

const HeroSection = z.object({
  type: z.literal("hero"),
  label: z.string().optional(),
  headline: z.string().min(1),
  sub: z.string().optional(),
  image: ImageRef.optional(),
  ctas: z.array(Cta).max(2).optional(),
});

const PillarGridSection = z.object({
  type: z.literal("pillarGrid"),
  heading: z.string().optional(),
  tagline: z.string().optional(),
  pillars: z.array(z.enum(PILLARS)).min(1),
});

const EditorialSplitSection = z.object({
  type: z.literal("editorialSplit"),
  label: z.string().optional(),
  headline: z.string().min(1),
  paragraphs: z.array(z.string()).default([]),
  bullets: z.array(z.string()).optional(),
  image: ImageRef.optional(),
  cta: Cta.optional(),
  reverse: z.boolean().optional(),
});

const StatBarSection = z.object({
  type: z.literal("statBar"),
  stats: z
    .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
    .min(1),
});

const PackageGridSection = z.object({
  type: z.literal("packageGrid"),
  heading: z.string().optional(),
  /** When true, renders the interactive sign-up flow (SPEC §9) instead of the static grid. */
  selectable: z.boolean().optional(),
});

const PackageTeaserSection = z.object({
  type: z.literal("packageTeaser"),
  heading: z.string().optional(),
  tagline: z.string().optional(),
  limit: z.number().int().positive().optional(),
  cta: Cta.optional(),
});

const TestimonialsSection = z.object({
  type: z.literal("testimonials"),
  heading: z.string().optional(),
  sub: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

const GallerySection = z.object({
  type: z.literal("gallery"),
  heading: z.string().optional(),
  images: z.array(ImageRef).min(1),
});

const FaqAccordionSection = z.object({
  type: z.literal("faqAccordion"),
  heading: z.string().optional(),
});

const CtaBannerSection = z.object({
  type: z.literal("ctaBanner"),
  variant: z.enum(["discovery-call", "enquire", "custom"]),
  headline: z.string().optional(),
  body: z.string().optional(),
  cta: Cta.optional(),
});

const ContactPanelSection = z.object({
  type: z.literal("contactPanel"),
  heading: z.string().optional(),
  sub: z.string().optional(),
});

export const SectionSchema = z.discriminatedUnion("type", [
  HeroSection,
  PillarGridSection,
  EditorialSplitSection,
  StatBarSection,
  PackageGridSection,
  PackageTeaserSection,
  TestimonialsSection,
  GallerySection,
  FaqAccordionSection,
  CtaBannerSection,
  ContactPanelSection,
]);

export const PageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  sections: z.array(SectionSchema),
});

/* ---------- package catalog (SPEC §6.3) ---------- */

export const PackageSchema = z.object({
  id: z.string().min(1),
  category: z.enum(PACKAGE_CATEGORIES),
  name: z.string().min(1),
  price: z.number().positive(),
  billing: z.enum(BILLING),
  features: z.array(z.string()),
  purchasable: z.boolean(),
  stripePriceId: z.string().optional(),
});

export const PackagesSchema = z
  .array(PackageSchema)
  .min(1)
  .refine(
    (pkgs) => new Set(pkgs.map((p) => p.id)).size === pkgs.length,
    "package ids must be unique",
  );

/* ---------- global content files (SPEC §6.4) ---------- */

export const SiteSchema = z.object({
  name: z.string().min(1),
  copyright: z.string().min(1),
  contact: z.object({
    phone: z.string().min(1),
    email: z.string().min(1),
    mailtoSubject: z.string().min(1),
    address: z.string().min(1),
    addressParts: z.object({
      street: z.string().min(1),
      locality: z.string().min(1),
      region: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().length(2),
    }),
    hours: z.string().optional(),
  }),
  links: z.object({
    booking: z.string().min(1),
    assessment: z.string().min(1),
    whatsapp: z.string().min(1),
    map: z.string().min(1),
  }),
  social: z.array(Cta).min(1),
  reviewCta: Cta,
  packageCta: Cta,
  packageCategories: z.record(z.enum(PACKAGE_CATEGORIES), z.string().min(1)),
  sauna: z.object({
    label: z.string().min(1),
    heading: z.string().min(1),
    body: z.string().min(1),
  }),
  signup: z.object({
    intro: z.string().min(1),
    nameLabel: z.string().min(1),
    phoneLabel: z.string().min(1),
    submitLabel: z.string().min(1),
  }),
  nav: z.array(Cta).min(1),
  footerLinks: z.array(Cta),
  footer: z.object({
    locationHeading: z.string().min(1),
    socialHeading: z.string().min(1),
    exploreHeading: z.string().min(1),
  }),
  pillars: z.record(
    z.enum(PILLARS),
    z.object({
      label: z.string().min(1),
      description: z.string().min(1),
      image: ImageRef,
    }),
  ),
});

export const TestimonialsFileSchema = z.array(
  z.object({
    name: z.string().min(1),
    quote: z.string().min(1),
    attribution: z.string().min(1),
  }),
);

export const FaqsFileSchema = z.array(
  z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  }),
);

/* ---------- inferred types ---------- */

export type Section = z.infer<typeof SectionSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Package = z.infer<typeof PackageSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Testimonial = z.infer<typeof TestimonialsFileSchema>[number];
export type Faq = z.infer<typeof FaqsFileSchema>[number];
