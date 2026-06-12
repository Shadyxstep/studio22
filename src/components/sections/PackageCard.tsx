import { Button } from "@/components/ui/Button";
import type { Globals } from "@/lib/content/load";
import type { Package } from "@/lib/content/schema";
import { formatPrice } from "@/lib/format";
import { getPackageCta } from "@/lib/packages";

/** Shared card for packageGrid and packageTeaser. */
export function PackageCard({
  pkg,
  globals,
}: {
  pkg: Package;
  globals: Globals;
}) {
  const cta = getPackageCta(pkg, globals.site);
  return (
    <article className="flex h-full w-full flex-col gap-5 rounded-card bg-slate p-8">
      <h3 className="min-h-[3.5rem] font-display text-xl leading-snug text-bone">
        {pkg.name}
      </h3>
      <p className="font-display text-2xl text-sage">{formatPrice(pkg)}</p>
      {pkg.features.length > 0 && (
        <ul className="flex flex-col gap-2">
          {pkg.features.map((f) => (
            <li
              key={f}
              className="border-l border-line pl-3 text-xs leading-relaxed text-mid"
            >
              {f}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-2">
        <Button href={cta.href} variant="outline">
          {cta.label}
        </Button>
      </div>
    </article>
  );
}
