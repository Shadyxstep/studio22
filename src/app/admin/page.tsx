import type { Metadata } from "next";
import Link from "next/link";
import { ChatEditor } from "./ChatEditor";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

// The admin hub (SPEC §15.3): the chat editor lives here; posts (T5.8) and
// plans (T5.9) get their own subpages.
export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-10 px-6 py-24">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mid">Studio 22</p>
          <h1 className="mt-2 font-display text-4xl text-bone">Admin</h1>
        </div>
        <LogoutButton />
      </div>
      <nav className="flex gap-6 text-sm text-mid">
        <Link className="text-bone" href="/admin" aria-current="page">
          Site editor
        </Link>
        <span>Articles (T5.8)</span>
        <span>Training plans (T5.9)</span>
      </nav>
      <ChatEditor />
    </main>
  );
}
