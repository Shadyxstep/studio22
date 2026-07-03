"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PlanRow {
  id: string;
  memberEmail: string;
  label: string;
  createdAt: string;
  revoked: boolean;
  link: string;
  mailto: string;
}

const inputCls =
  "rounded-2xl border border-line bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-sage";

export function PlansManager() {
  const [plansList, setPlansList] = useState<PlanRow[]>([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/plans");
    const json = await res.json();
    if (json.ok) setPlansList(json.data);
    else setNotice(json.error);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function upload(event: React.FormEvent) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setBusy(true);
    setNotice(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("memberEmail", memberEmail);
      form.set("label", label);
      const res = await fetch("/api/admin/plans", { method: "POST", body: form });
      const json = await res.json();
      if (json.ok) {
        setMemberEmail("");
        setLabel("");
        if (fileRef.current) fileRef.current.value = "";
        setNotice("Uploaded — copy the link or open the email below.");
        await refresh();
      } else {
        setNotice(json.error);
      }
    } finally {
      setBusy(false);
    }
  }

  async function setRevoked(plan: PlanRow, revoked: boolean) {
    await fetch(`/api/admin/plans/${plan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoked }),
    });
    await refresh();
  }

  async function copyLink(plan: PlanRow) {
    await navigator.clipboard.writeText(plan.link);
    setNotice(`Link for ${plan.memberEmail} copied.`);
  }

  return (
    <section className="flex flex-col gap-8">
      <form
        onSubmit={upload}
        className="flex flex-col gap-4 rounded-2xl border border-line p-5"
      >
        <p className="text-xs uppercase tracking-[0.15em] text-mid">
          Send a plan to a member
        </p>
        <label className="flex flex-col gap-2 text-sm text-mid">
          Member email
          <input
            type="email"
            required
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-mid">
          Plan name (they&apos;ll see this)
          <input
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. 12-week strength block — phase 1"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-mid">
          PDF
          <input ref={fileRef} type="file" accept="application/pdf" required className="text-sm" />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="self-start rounded-full border border-sage bg-sage px-6 py-3 text-sm text-ink transition-colors hover:bg-sage/85 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload & get link"}
        </button>
      </form>

      {notice && <p className="text-sm text-sage">{notice}</p>}

      {plansList.length === 0 ? (
        <p className="text-sm text-mid">No plans sent yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {plansList.map((plan) => (
            <li key={plan.id} className="flex flex-wrap items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-bone">{plan.label}</p>
                <p className="text-xs text-mid">
                  {plan.memberEmail}
                  {plan.revoked && " · revoked"}
                </p>
              </div>
              {!plan.revoked && (
                <>
                  <button
                    type="button"
                    onClick={() => copyLink(plan)}
                    className="text-sm text-mid hover:text-bone"
                  >
                    Copy link
                  </button>
                  <a href={plan.mailto} className="text-sm text-sage hover:opacity-80">
                    Email it
                  </a>
                </>
              )}
              <button
                type="button"
                onClick={() => setRevoked(plan, !plan.revoked)}
                className={
                  plan.revoked
                    ? "text-sm text-sage hover:opacity-80"
                    : "text-sm text-red-400 hover:opacity-80"
                }
              >
                {plan.revoked ? "Restore" : "Revoke"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
