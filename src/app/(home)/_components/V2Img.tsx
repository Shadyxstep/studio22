import Image from "next/image";
import type { CSSProperties } from "react";
import type { V2ImageType } from "@/lib/content/schema";

/* next/image (fill) with the crop anchors from content as CSS variables;
   v2.css switches to positionWide from the desktop breakpoint up. */
export function V2Img({
  image,
  sizes,
  className = "",
  priority = false,
}: {
  image: V2ImageType;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const style = {
    ...(image.position && { "--pos": image.position }),
    ...(image.positionWide && { "--pos-wide": image.positionWide }),
  } as CSSProperties;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      className={`v2-img ${className}`}
      style={style}
    />
  );
}
