import type { ReactNode } from "react";

/** Wide-tracked uppercase micro-label (SPEC §8.2). */
export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.2em] text-sage ${className}`}
    >
      {children}
    </p>
  );
}
