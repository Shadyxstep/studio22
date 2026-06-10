# Deployment runbook — studio-22.ie (Milestone 4)

Human-led steps marked **[you]**; everything else is already in the repo.

## 1. Vercel project

1. **[you]** Push this repo to GitHub (private is fine) and import it at
   vercel.com/new — or deploy directly from this machine with
   `npx vercel` (framework auto-detected: Next.js, build `pnpm build`).
2. **[you]** Project → Settings → Environment Variables (Production):
   - `NEXT_PUBLIC_SITE_URL=https://studio-22.ie`
   - Nothing else. Stripe keys stay unset until payments activation
     (`STUDIO22_PAYMENTS` defaults to dormant).
3. Deploy. The preview URL is fully functional — share it with the owner
   for sign-off before cutover.

## 2. Pre-cutover checks (on the preview URL)

- [ ] All six pages render; theme toggle works; mobile nav at 375px
- [ ] Sign-up flow opens a pre-filled email (test on a phone — that's
      where mailto UX matters)
- [ ] Discovery-call link reaches the Google Calendar booking page
- [ ] `/our-packages` 301s to `/packages` (spot-check the legacy redirects)
- [ ] Lighthouse ≥95 ×4 (Chrome DevTools → Lighthouse, mobile preset)
- [ ] OG preview looks right (e.g. opengraph.xyz against the preview URL)

## 3. Domain cutover

1. **[you]** Vercel project → Settings → Domains → add `studio-22.ie`
   and `www.studio-22.ie` (redirect www → apex).
2. **[you]** At the DNS provider (wherever studio-22.ie is registered):
   - `A` record `@` → `76.76.21.21`
   - `CNAME` record `www` → `cname.vercel-dns.com`
   (Vercel's Domains screen shows the authoritative values — prefer those
   if they differ.)
3. Wait for the certificate to issue (minutes). The old WordPress host
   keeps serving until DNS propagates — zero-downtime cutover.
4. **[you]** Keep the WordPress hosting active (paused/cheapest tier) for
   ~2 weeks as rollback, then cancel. Note: `fitness.studio-22.ie`
   (exercise.com funnel) is a separate subdomain — DO NOT touch its DNS
   record; the new site links to it.

## 4. Post-launch

- [ ] `https://studio-22.ie/sitemap.xml` loads; submit in Google Search
      Console (verify the property via DNS TXT if not already)
- [ ] Spot-check the legacy URLs from old Google results redirect properly
- [ ] Owner walkthrough: how to request content changes (everything lives
      in `content/` — this becomes the v2 agent's surface)
- [ ] Work through README "Before launch" content items as the owner
      supplies them (hours, FAQs, photos, logo)

## Rollback

DNS back to the old host's records. Nothing on the WordPress side was
modified by this project.
