import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { getContent } from "@/lib/content/serve";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return { title: site.checkout.cancelled.headline, robots: { index: false } };
}

export default async function CheckoutCancelledPage() {
  const { site } = await getContent();
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-display text-5xl text-bone">
        {site.checkout.cancelled.headline}
      </h1>
      <p className="text-sm leading-7 text-mid">
        {site.checkout.cancelled.body}
      </p>
      <Button href="/" className="mt-4">
        {site.checkout.backLabel}
      </Button>
    </main>
  );
}
