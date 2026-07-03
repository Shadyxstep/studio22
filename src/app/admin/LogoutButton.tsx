"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="self-start rounded-full border border-line px-7 py-3.5 text-sm tracking-[0.04em] text-bone transition-colors duration-300 hover:border-bone"
    >
      Sign out
    </button>
  );
}
