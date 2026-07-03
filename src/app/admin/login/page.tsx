import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Owner login",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center gap-8 px-6 py-24">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-mid">Studio 22</p>
        <h1 className="mt-2 font-display text-4xl text-bone">Owner login</h1>
      </div>
      <LoginForm />
    </main>
  );
}
