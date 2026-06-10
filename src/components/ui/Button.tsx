import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline";

const styles: Record<Variant, string> = {
  solid:
    "border border-sage bg-sage text-ink hover:bg-transparent hover:text-sage",
  outline: "border border-line text-bone hover:border-sage hover:text-sage",
};

const base =
  "inline-flex items-center justify-center px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage";

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
      </Link>
    );
  }
  return (
    <a href={href} className={cls} rel="noopener">
      {children}
    </a>
  );
}
