import type { ComponentType } from "react";
import type { Globals } from "@/lib/content/load";
import {
  SECTION_TYPES,
  type Section,
  type SectionType,
} from "@/lib/content/schema";
import { BookingEmbed } from "./BookingEmbed";
import { ContactPanel } from "./ContactPanel";
import { CtaBanner } from "./CtaBanner";
import { EditorialSplit } from "./EditorialSplit";
import { FaqAccordion } from "./FaqAccordion";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { PackageGrid } from "./PackageGrid";
import { PackageTeaser } from "./PackageTeaser";
import { PillarGrid } from "./PillarGrid";
import { StatBar } from "./StatBar";
import { Testimonials } from "./Testimonials";

/*
 * The closed section registry (SPEC §6.2). Keys are exactly SECTION_TYPES;
 * an unknown type is a build failure at prerender, never a silent skip.
 */
type AnySectionComponent = ComponentType<{ section: never; globals: Globals }>;

const registry: Record<SectionType, AnySectionComponent> = {
  hero: Hero,
  pillarGrid: PillarGrid,
  editorialSplit: EditorialSplit,
  statBar: StatBar,
  packageGrid: PackageGrid,
  packageTeaser: PackageTeaser,
  testimonials: Testimonials,
  gallery: Gallery,
  faqAccordion: FaqAccordion,
  ctaBanner: CtaBanner,
  contactPanel: ContactPanel,
  bookingEmbed: BookingEmbed,
};

export const REGISTERED_SECTION_TYPES = Object.keys(registry) as SectionType[];

export function SectionRenderer({
  sections,
  globals,
}: {
  sections: Section[];
  globals: Globals;
}) {
  return (
    <>
      {sections.map((section, i) => {
        const Component = registry[section.type];
        if (!Component) {
          throw new Error(
            `Unknown section type "${section.type}" — registry covers: ${SECTION_TYPES.join(", ")}`,
          );
        }
        return (
          <Component
            key={`${section.type}-${i}`}
            section={section as never}
            globals={globals}
          />
        );
      })}
    </>
  );
}
