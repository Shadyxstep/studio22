# Content Inventory — studio-22.ie

> T0.2 deliverable. Verbatim copy and data captured from the live site on 2026-06-10, organised by **target page** (SPEC §9). Copy in quotes is exact, including punctuation and the em-dashes/typos of the source. Items the live site does not provide are marked `HUMAN TODO`. Source pages fetched: `/`, `/get-started/`, `/our-packages/`, `/contact-us/`, `/gym-packages/`, `/pilates-packages/`, `/full-studio-package/`, `/strength/`, `/reformer-pilates/`, `/golf/`, `/online-coaching/`, `/golf-performance-program/`, `/we-are-open/` (+ `/our-facility/`, FAQs and Free Resources — all **404**, see Gaps).

---

## 1. Global (`content/site.json`)

**Identity**
- Name: Studio 22
- Copyright line: "© Copyright 2026 / Studio 22"

**Contact**
- Phone: `+353 874094321`
- Email: `admin@studio-22.ie` (live mailto uses subject "I'm Interested In Studio 22")
- Address: "77 Georges Street Upper, Dun Laoghaire, Dublin, Ireland A96 RX61"
- Opening hours: **HUMAN TODO — not published anywhere on the live site** (needed for contact page + JSON-LD)

**External URLs**
| Purpose | URL |
|---|---|
| Discovery call booking (Google Calendar → Meet) | `https://calendar.app.google/czDrog5tJp515A1x6` |
| Assessment funnel ("Want more info?" / "Get Started Today!") | `https://fitness.studio-22.ie/a/assessment/2541068/` |
| Google review CTA | `https://search.google.com/local/writereview?placeid=ChIJV6gbKv0HZ0gRig71rOCeM18` |
| WhatsApp ("Join Us" on Get Started) | `https://api.whatsapp.com/message/65QFIMXJ4BDOO1` |
| Instagram | `https://www.instagram.com/studio22dublin` |
| TikTok | `https://www.tiktok.com/@studio22dublin` |
| exercise.com simulator products list | `https://fitness.studio-22.ie/ex4/purchase/locations/2474/products` |

**Live nav:** Home · Get Started · Our Packages · Contact Us (header CTA). Footer adds FAQs + Free Resources (both dead links, see Gaps).

**Sauna perk (verbatim, packages page):**
> "All memberships include access to our on-site sauna to help recovery, reduce soreness, and improve overall wellbeing."

**Footer micro-copy:** "Where we're located, give us a visit." · "We're pretty active on social, check us out." · "Or keep exploring our site to learn more."

---

## 2. Home (`content/pages/home.json`)

**Hero**
- H1: "The Future of Wellness."
- Sub: "Movement. Strength. Recovery. Community"
- CTAs: "Want more info?" → assessment funnel · "book a discovery call" → booking URL

**Promo banner (time-limited, June 2026 — owner decides whether to carry):**
- H2: "Discover Reformer Pilates with Our June Trial Offer"
- Body: "New to Reformer Pilates? Grab our special 5-Class Trial Pack this June and see what everyone is talking about. Limited-time offer, one pack per account."
- CTA: "Sign Up" → `https://fitness.studio-22.ie/packages/73866/purchase/`

**Our Offering (numbered 01–05):** tagline "Performance is the greatest motivator"
01 Full Studio Package · 02 Online Coaching · 03 Strength · 04 Reformer Pilates · 05 Golf
(maps to v1 pillarGrid: gym/strength, golf, pilates, recovery + packageTeaser)

**Testimonials intro:** H2 "Trusted By Our Community" — "Discover authentic Google reviews from clients who've experienced Studio 22 firsthand."

**Closing CTA block:**
- H2: "Start Today, Feel Better Tomorrow"
- Body: "We know walking through the door is the hardest part. You take the first step and we'll meet you where you are."
- Cards: "See How We Help You" / "See what it's like to get started with Studio 22" · "See Our WorldClass Facility" / "Learn more about place where you can change your life!" (note: links to /our-facility which is 404 on the live site)

---

## 3. Facility (`content/pages/facility.json`) — pillar copy from detail pages

**Strength / Gym** (from `/strength/`, hero sub: "Build Real Strength. Move With Confidence. Feel Powerful.")
- Pain points (H2 "Want to start strength training but don't know where to begin"): "Exercising, but not seeing progress?" · "Nervous about barbells or proper form?" · "Want to feel stronger without beating up your body?" · "You're not alone - Join an amazing community of people all striving to be the best versions of themselves"
- H2 "Training that actually works": "Foundational barbell and dumbbell lifts" · "Proper technique and coaching" · "Balanced training for muscle, joints, and mobility" · "Every session is structured to help you improve week after week."
- "Who this program is for": "✔ Beginners who want to learn proper lifting" · "✔ Professional athletes looking to perform at their best" · "✔ Anyone who wants to feel strong, capable, and empowered" — "Performance is the best motivator."

**Reformer Pilates** (from `/reformer-pilates/`)
- Pain points (H2 "Want to move better but unsure where to start?"): "Dealing with tight muscles or stiffness" · "Want low-impact training that still challenges you" · "Looking to improve posture and core strength" · "Need guided movement instead of guessing exercises" · "You don't need experience — we coach you through every movement step by step."
- H2 "Precision training that supports your body": "Controlled reformer-based movements" · "Core stability and posture improvement" · "Joint-friendly strength and mobility work" · "Personalized coaching and progressions" · "Each session helps you build strength, flexibility, and confidence safely."
- Mentions "Morning Classes" / "Evening Classes" timetable headings.

**Golf** (from `/golf/`, hero sub: "Train smarter. Hit farther. Play better golf.")
- Pain points (H2 "Want to improve your golf game but not sure where to start?"): "Struggling with consistency off the tee" · "Unsure why your distances vary" · "Want structured practice instead of guessing" · "Looking to lower your scores" · "You don't need to figure it out alone — our system shows you exactly what to work on."
- H2 "Data-driven training that actually works": "TrackMan swing and ball-flight analysis" · "Accurate distance and dispersion tracking" · "Realistic virtual course play" · "Practice plans focused on improvement" · "Every session gives you clear feedback so you can practice smarter and play better."

**Recovery / Sauna** (from `/our-packages/`)
- H3 "Sauna" · H2 "Recovery & Relaxation" + the sauna perk line (§1). Photography carries this pillar.

**Full Studio cross-pillar copy** (from `/full-studio-package/`): H2 "Build real strength": "Strength training & conditioning" · "Progressive overload programming" · "Technique coaching for all levels" · "Improve power and confidence" · "Train with purpose and measurable progress every week." — H2 "Move better with Pilates": "Core strength and stability" · "Improve posture and mobility" · "Low-impact full body training" · "Build control and body awareness" · "Feel stronger, more mobile and balanced in everyday movement."

---

## 4. Packages (`content/packages.json`) — cross-checked ✓ matches SPEC §6.3 exactly

Grouping headers on live site: "Gym Class Packages" · "Pilates Packages" · "Online Coaching and Golf".

| SPEC id | Live name | Price (verbatim) | exercise.com purchase URL (for future `purchasable` activation / reference) |
|---|---|---|---|
| unlimited-gym | Unlimited Gym Class Package | "€55/week" | `…/packages/61447/purchase/` |
| performance | Performance Package | "€75/week" | `…/packages/61487/purchase` |
| complete-studio | Complete Studio Package | "€75/week" | `…/packages/61488/purchase` |
| pilates-membership | Pilates Membership | "€50/week" | `…/packages/61486/purchase/` |
| reformer-10 | 10 Reformer Pilates Class Package | "One Time Payment: €225" | `…/packages/65549/purchase/` |
| reformer-20 | 20 Reformer Pilates Class Package | "One Time Payment: €425" | `…/packages/65550/purchase/` |
| online-coaching | Online Coaching (a.k.a. "Studio 22 Online Performance Coaching") | "€35/week" | `…/packages/61445/purchase/` |
| simulator | Simulator Package | "€60/week" | `…/packages/66303/purchase/` |

(base: `https://fitness.studio-22.ie`)

**Package features:** the live site lists no per-package feature bullets — the closest is the pillar copy in §3. `HUMAN TODO`: owner to confirm per-package feature lists; v1 seeds `features` from the relevant pillar bullets above (logged as a decision).

---

## 5. Get Started (`content/pages/get-started.json`)

- H1: "Get Started At Studio 22"
- Step 01 — "Not sure where to start?": "Most clients begin with an assessment. Book in for your Movement screening below." CTA "Join Us" → WhatsApp link.
- Step 02 — "Ready to go ?": "Purchase your Studio 22 Membership below" CTA "Purchase Now" → gym packages.
- Step 03 — "Need more information?": "Book in in for a discovery call below and we can go over any more queries you may have." CTA "Book A Discovery Call" → booking URL. (sic: "Book in in")
- H2: "How Do We Help You Reach Your Goals?" — "Scroll down to see our timeline to get you from today to the future healthier, happier you."
- **5-week programme timeline** (full verbatim paragraphs captured in `/tmp` extraction; three paragraphs each):
  - "Week 1 – Foundational Phase" — "Week one is all about laying the foundations…" / "Loads and volumes are kept manageable and intentional…" / "This week sets the standard for everything that follows — move well, stay consistent, and build a solid base for long-term progress."
  - "Week 2 – Accumulation Phase" — "Week two focuses on building volume and confidence in the movements…" / "We'll slightly increase the rep ranges this week…" / "Focus on smooth, controlled reps, consistent breathing, and maintaining good technique throughout each set…"
  - "Week 3 – Intensification Phase 1" — "This phase marks the shift from building volume to building strength…" / "The focus here is on producing more force through the same solid patterns…" / "This phase helps convert the work you've already done into measurable strength gains…"
  - "Week 4 – Intensification Phase 2" — "In this phase, we continue to build on the strength gains from Intensification Phase 1…" / "As training demands increase, recovery becomes just as important as the work itself…" / "To balance the heavier lifting… We strongly encourage trying one of our Reformer Pilates classes, which are available at a reduced rate for current Studio 22 members…" / "This phase is about training smart — pushing strength forward while supporting your body to perform at its best."
  - "Week 5 - Realisation Phase" — "The Realisation Phase is where all the work comes together…" / "By this stage, your body has been progressively prepared…" / "Training in this phase is focused, intentional, and well-supported…" / "This is about expressing strength — not forcing it — and finishing the programme feeling strong, capable, and resilient."
  (Note: paragraphs abbreviated here with "…" for inventory readability only. The complete verbatim text of every fetched page is committed at `docs/source-text/*.txt` — T1.3 seeds content files from those, no network needed.)
- Closing block: H2 "You deserve to feel confident and strong in your body." — H4 "At Studio 22 we focus on real, long-term results." — "Whether you want to keep up with the kids, rock a new swimsuit, or even just carry the groceries in by yourself — our goal is to give everyone the freedom of independent fitness for life." — "For us, fitness is about community and the commitment to working hard for permanent changes that you can be proud of. Our coaches go through rigorous training to help every member improve their quality of life no matter when they decide to start."
- Repeats "Start Today, Feel Better Tomorrow" block (§2).

---

## 6. Testimonials (`content/testimonials.json`) — 5 Google reviews, verbatim

1. **Lauren Airey** — "I attended a reformer Pilates class this week and Sarah was the teacher. I have been to many reformer classes before but I would say this was one of my favorites so far. I really liked that Sarah was always there to correct my form and to keep me motivated. I also really liked that there was always options to make each movement harder. The room was very clean and bright but also very calming at the same time. I can't wait to go back again."
2. **Sophia Simmonds** — "Amazing new gym in Dun Laoghaire - have done both the sweat classes and the Reformer Pilates and both were excellent! Both instructors were very good and I will definitely be back. Also, the sauna facility is a great addition to the space!"
3. **Shananne Smith** — "I recently took my first Pilates class at Studio 22 and absolutely loved it! The instructor was really friendly and knowledgeable, making sure to adjust poses and give a variety of movements depending on your level and how much you wanted to push yourself. The stunning sauna after was the icing on the cake after a tough class. Will definitely be back!"
4. **Richie Power** — "Quality New Gym in the area. All the equipment is top of the range and brand new."
5. **Matias Giannetti** — "Top Class Gym in an incredible location, very well equipped with high quality equipment. The staff are friendly and always keen to help. Having a sauna for post session recovery is very nice too."

Attribution line used by the live widget: "Posted on Google".

---

## 7. Contact (`content/pages/contact.json`)

- H1: "Contact Us"
- Sub: "Whether you're looking for a gym in Dun Laoghaire or have questions about fitness in general we are here to answer them!"
- H2: "We'd Love to hear from you!" — "Fill out the form to get in touch with us." (v1 renders this as the mailto-composing contact panel per SPEC §9)
- Phone / email / address as §1. Google Maps link: `HUMAN TODO` (live site embeds a map; a maps.google.com share link for the address is needed — derivable from the place ID above).

---

## 8. Gaps & flags (do not invent — owner input needed)

- **FAQs page: 404 on the live site** (`?page_id=125638`). No FAQ copy exists anywhere. `HUMAN TODO`: owner supplies FAQ content; until then `faqs.json` ships with an empty list and the FAQs page renders its empty state. (SPEC default already omits it from nav.)
- **Free Resources: 404** (`?page_id=125841`) — confirms SPEC default: omit.
- **/our-facility/: 404**, yet the homepage links to it ("Our World Class Facility"). v1's Facility page is assembled from §3 pillar copy + photography — there is no live facility page to mirror.
- **Opening hours: not published** — needed for contact page and LocalBusiness JSON-LD.
- **No per-package feature bullets** on the live site (see §4).
- **Golf Performance Program** (`/golf-performance-program/`): a rich 6-week €399 promo landing page (TrackMan, "Get Summer Golf Ready", Mon/Wed/Fri 6:10 PM, max 8 athletes, purchase id 70026). **Not in the v1 sitemap** (SPEC §9 lists six pages). Flagged for owner: carry as a 7th page later or let it expire with the season.
- **June trial-pack promo** on home (§2) is time-limited; owner decides carry/drop at launch.
- Live site has **no facility photography to harvest** beyond what we hold; the 11 local JPEGs are the v1 image set.
