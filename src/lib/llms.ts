import { loadPackages, loadPage, loadSite, loadV2Home } from "./content/load";
import { indexablePages, pagePath, SITE_URL } from "./seo";

/* Plain-markdown site summary served at /llms.txt (llmstxt.org). */
const BILLING: Record<string, string> = { weekly: "per week", monthly: "per month", "one-time": "one-off" };

export function buildLlmsTxt(): string {
  const site = loadSite();
  const v2 = loadV2Home();
  const home = loadPage("home");
  const c = site.contact;
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${home.description}`,
    "",
    `${site.name} is at ${c.address}. Phone ${c.phone}, email ${c.email}.`,
    "",
    "## What we offer",
    "",
    ...v2.offering.cards.map((card) => `- **${card.title}**: ${card.description}`),
    "",
    "## Packages and prices (EUR)",
    "",
    ...loadPackages().map(
      (p) => `- ${p.name}: €${p.price} ${BILLING[p.billing] ?? p.billing}. ${p.features.join("; ")}.`,
    ),
    "",
    "## Weekly class timetable",
    "",
  ];
  const tt = v2.timetable;
  for (const s of tt.schedules) {
    lines.push(`### ${s.tab}`, "");
    for (const cls of s.classes) lines.push(`- ${cls.legend}: ${cls.detail}`);
    lines.push("");
    tt.days.forEach((_, i) => {
      const sessions = s.rows
        .filter((r) => r.slots[i])
        .map((r) => `${r.time} ${s.classes.find((x) => x.key === r.slots[i])!.legend}`);
      if (sessions.length) lines.push(`- ${tt.dayNames[i]}: ${sessions.join(", ")}`);
    });
    lines.push("");
  }
  lines.push(
    `Book classes online: ${tt.book.href}`,
    "",
    "## Getting started",
    "",
    `${v2.gettingStarted.body} ${v2.gettingStarted.note}`,
    ...v2.gettingStarted.timeline.steps.map((s) => `- ${s.when}: ${s.title}. ${s.body}`),
    "",
    "## Pages",
    "",
    ...indexablePages().map((n) => {
      const p = loadPage(n);
      return `- [${p.title}](${SITE_URL}${pagePath(n)}): ${p.description}`;
    }),
    "",
    "## Links",
    "",
    `- Book a discovery call: ${site.links.booking}`,
    `- Book an assessment: ${site.links.assessment}`,
    `- WhatsApp: ${site.links.whatsapp}`,
    `- Map: ${site.links.map}`,
    ...site.social.map((s) => `- ${s.label}: ${s.href}`),
    "",
  );
  return lines.join("\n");
}
