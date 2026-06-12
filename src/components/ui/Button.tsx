import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline";

const styles: Record<Variant, string> = {
  solid: "border border-sage bg-sage text-ink hover:bg-sage/85",
  outline: "border border-line text-bone hover:border-bone",
};

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm tracking-[0.04em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage";

function Arrow() {
  return (
    <span
      aria-hidden
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
        <Arrow />
      </Link>
    );
  }
  return (
    <a href={href} className={cls} rel="noopener">
      {children}
      <Arrow />
    </a>
  );
}
