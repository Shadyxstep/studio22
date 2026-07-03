import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

// The admin hub (SPEC §15.3). Editor / posts / plans arrive with their
// milestones (T5.6, T5.8, T5.9); this page is the authenticated shell.
export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center gap-10 px-6 py-24">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mid">Studio 22</p>
        <h1 className="mt-2 font-display text-4xl text-bone">Admin</h1>
      </div>
      <nav className="flex flex-col gap-4 text-bone">
        <Link className="hover:text-sage" href="/admin">
          Site editor <span className="text-mid">(coming with T5.6)</span>
        </Link>
        <Link className="hover:text-sage" href="/admin">
          Articles <span className="text-mid">(coming with T5.8)</span>
        </Link>
        <Link className="hover:text-sage" href="/admin">
          Training plans <span className="text-mid">(coming with T5.9)</span>
        </Link>
      </nav>
      <LogoutButton />
    </main>
  );
}
