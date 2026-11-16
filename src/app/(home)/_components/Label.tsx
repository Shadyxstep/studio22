/** "01 · Our Offering" section label; the number is the section's position. */
export function Label({ n, children }: { n: number; children: string }) {
  return (
    <p className="v2-label">
      <b>{String(n).padStart(2, "0")}</b>
      <i aria-hidden>·</i>
      {children}
    </p>
  );
}
