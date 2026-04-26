# Product Roadmap — UI/UX Polish + Business Features

**Date:** 2026-04-26
**Stage context:** MVP for first 10 clients. Bilingual AR/EN, deployed to Railway + GitHub Pages. Backend on Railway. Single backoffice viewer exists.
**Goal of this doc:** Catalog ideas that move the product forward from "works end-to-end" to "we'd actually pay for this." Each item has a one-line rationale, rough effort (S=hours, M=days, L=weeks), and a priority (P1=do soon, P2=nice next quarter, P3=parking lot). Ordered within each section by my recommended order, not by priority.

---

## Theme 1 — Survey completion & engagement

The survey is the funnel. Drop-off here = no data = no save = no insight.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 1.1 | **Progress bar** at the top of the Survey page (filled by `idx / total`) | Users without a progress signal abandon. The "question 7/24" counter is too quiet. | S | **P1** |
| 1.2 | **Auto-save indicator** — small "Saved" pill that flashes when an answer persists to localStorage | Build trust that data isn't being lost; counters anxiety on long surveys. | S | **P1** |
| 1.3 | **Skip + come-back** — let user skip a question, mark it as pending, and surface unanswered ones at the end before Analyze | Some questions need cross-team input; forcing linear answer kills sessions. | M | **P1** |
| 1.4 | **Per-respondent progress** in the role pills (e.g., `Manager 12/18`) | When multiple respondents are involved, you need to see who's lagging. | S | P2 |
| 1.5 | **Resume banner** — when persisted state loads, show "Continue from question N" with a Reset link | Currently it silently puts you back into the survey at question 0; confusing. | S | **P1** |
| 1.6 | **Question groups / sections** with collapsible navigation in a left rail | The 25 questions span 8 axes; users want to jump directly to a section. | M | P2 |
| 1.7 | **Required-vs-optional marking** on questions | Currently no question is required; people skim and produce thin reports. | S | P2 |
| 1.8 | **Smart defaults** based on company size / industry (pre-fill scoring on questions that are statistically tied) | Reduces cognitive load; rewards short answers. Risk: bias the data. | M | P3 |

---

## Theme 2 — Results page value

This is what the client takes away. It needs to feel like a $$ deliverable.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 2.1 | **Branded PDF report** with logo, cover page, executive summary, a real layout (not the current `window.print` hack) | The PDF is the artifact you leave behind. Right now it looks like dev output. Use react-pdf or Puppeteer-on-backend. | M–L | **P1** |
| 2.2 | **Email report directly** to the client/assessor from the Results page | Removes the "download then attach" friction; backend already has email field. | M | **P1** |
| 2.3 | **Shareable read-only link** to results (`/results/{publicId}`) — backend mints a signed URL | Clients forward to colleagues without you needing to re-send. | M | P2 |
| 2.4 | **Industry benchmark comparison** — "you scored X on Data; peers in 50–200 construction firms average Y" | Turns a personal score into a relative position. Needs a few dozen completed assessments first to seed. | L | P2 |
| 2.5 | **Quick-win prioritization slider** — let user weight by effort/impact; reorder recommendations | Different clients care about different axes. | S | P2 |
| 2.6 | **ROI calculator playground** — interactive sliders on the Results page (engineers, hourly cost, saving rate) that recompute live | You already have the math; just expose it. Hugely persuasive in sales conversations. | S–M | **P1** |
| 2.7 | **"What changes after we engage" projection** — show the score with quick-wins applied | Sales tool: makes the "after" state concrete. | M | P2 |
| 2.8 | **Spider chart for axis scores** (8-axis radar) | Visual that's instantly readable; printable; great for slide decks. | S | **P1** |
| 2.9 | **Per-role drill-down** on Results — already computed in `axisScoresByRole`, just not surfaced | Highlights internal alignment/disagreement, which is itself a finding. | S | P2 |

---

## Theme 3 — Branding & visual polish

The cream/teal palette is in. Now the marketing-site sibling treatment.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 3.1 | **Hero treatment on the Start page** — large headline, short tagline, brand mark, generous spacing | First impression sells everything that follows; current Start is dense. | S | **P1** |
| 3.2 | **Subtle background texture** (cream paper grain, or a faint geometric pattern in `surface-alt`) — **not** a gradient | The infraai-dx.com aesthetic has texture, not flat color. | S | P2 |
| 3.3 | **Custom radio + checkbox** styling matching the 2px brand geometry | Browser defaults break the cohesion. | S | **P1** |
| 3.4 | **Iconography pass** — replace `●` `○` `◐` theme icons with proper SVG line icons (sun/moon/contrast, language) | Glyphs look like a placeholder; SVGs cost ~2KB and look intentional. | S | P2 |
| 3.5 | **Typographic hierarchy audit** — match the type scale defined in spec (`12/14/16/18/22/28/36`) consistently across pages | Some places use `text-lg`, others `text-xl`; rationalize. | S | P2 |
| 3.6 | **Empty / loading states** — skeletons for Results sections while sync is in flight; friendlier "no data yet" copy | Currently shows blank or technical messages. | S | P2 |
| 3.7 | **Animated section transitions** between Start → Survey → Results (subtle slide/fade) | Tiny touch that makes it feel less like four separate forms. | S | P3 |
| 3.8 | **Print stylesheet** for the Results page (so Cmd+P from the page produces a clean printout, not the current popup hack) | The popup-window approach is fragile and looks bad. | S | P2 |

---

## Theme 4 — Mobile & responsive

The PWA is installed on phones; today's layout is desktop-first.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 4.1 | **Mobile bottom nav for Survey** — Prev / Next / Finish as a fixed bottom action bar, single-column question | The current button row is awkward on phones; thumb reach matters. | S | **P1** |
| 4.2 | **Tablet layout for Survey** — split-pane (question + role rail) below the desktop split-pane breakpoint | Field engineers will use tablets in trucks. | M | P2 |
| 4.3 | **Swipe gestures** between questions on touch devices | Native-feeling navigation; matches PWA install positioning. | S | P3 |
| 4.4 | **Offline-first verification** — explicit "offline" banner when network drops, queue submissions for retry | The PWA already caches the shell; sync queue isn't there. | M | P2 |

---

## Theme 5 — Trust & conversion

Things that make a lead take you seriously enough to schedule a follow-up.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 5.1 | **"Schedule follow-up" CTA on Results** — embed Calendly / Google Calendar booking link on the Results page | The natural next step after seeing the report; do not let them cool off. | S | **P1** |
| 5.2 | **Methodology page / link** — short page explaining how scoring works | Buyers ask; having an answer ready closes deals. | S | P2 |
| 5.3 | **Privacy / data-handling note** on Start | Construction firms in KSA care about data residency; currently nothing addresses it. | S | **P1** |
| 5.4 | **Case studies / social proof** — small "X firms assessed" counter or 1–2 testimonial pull-quotes on the landing surface | Standard SaaS trust pattern. Skip until you actually have testimonials. | S | P3 |
| 5.5 | **Branded loading / completion confetti** on Analyze click | Makes the moment feel like an accomplishment. Tiny effort, oversized emotional payoff. | S | P3 |

---

## Theme 6 — Backoffice & business intelligence

The other Railway service consumes data; make it more useful.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 6.1 | **Assessment list view** (already exists per backend?) — add filters by date, score range, company size, city | When you have 30 assessments, browsing matters. | S–M | P2 |
| 6.2 | **Aggregate dashboard** — average score by axis, distribution histogram, common pain signals across all clients | This is the data product hidden inside the backend. Powers content marketing too. | M | P2 |
| 6.3 | **Re-assess** an existing client (clone meta, fresh respondents) and see the delta | Repeat-engagement value prop; "we measured improvement after 6 months." | M | **P1** |
| 6.4 | **Export to CSV / Excel** of one assessment or a filter set | Buyers want to drop it into their own tools. | S | P2 |
| 6.5 | **Client portal** — read-only view for the assessed client to revisit their report and recommendations | Removes you from the loop for re-checks; positions you as ongoing partner. | L | P3 |
| 6.6 | **Notes & action-items** — assessor can annotate findings post-survey, attach files | Turns a one-shot report into an evolving engagement record. | M | P3 |

---

## Theme 7 — AI / smart features

Use the readiness data to do something with AI in the product itself.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 7.1 | **AI-generated executive summary** in the report — 2 paragraphs in the client's voice based on answers + scores | The product is about AI-readiness; it should *use* AI in the deliverable. Use Claude API. | M | **P1** |
| 7.2 | **Suggested follow-up questions** — when a respondent's answer triggers a flag, show a contextual probe | Increases data quality without bloating the question bank. | M | P2 |
| 7.3 | **Voice-to-text for note fields** in the survey (Web Speech API) | Field engineers can't type on phones in PPE. Browser-native, no API cost. | S | P2 |
| 7.4 | **Photo upload per question** (e.g., "show me your current dashboard") for Operations questions | Qualitative artifact alongside the score; later: AI analyzes the photo. | M | P3 |
| 7.5 | **Conversational mode** — chat-style alternative to the form survey, driven by an LLM that asks the questions | Lowers cognitive load for non-technical respondents. Bigger swing. | L | P3 |

---

## Theme 8 — Integrations & lead-gen

You're collecting contact info on every assessment. Use it.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 8.1 | **Webhook on assessment complete** → Zapier/Make integration → Slack/email/CRM | One-off integrations for free; serves you until you need a proper pipeline. | S | **P1** |
| 8.2 | **HubSpot / Pipedrive contact sync** — push the contact + score on submit | Keeps your sales pipeline in one place. | M | P2 |
| 8.3 | **Calendar booking embed** on Results (covered in 5.1) | — | — | — |
| 8.4 | **Email drip sequence** triggered by score band (low → "starter pack", mid → "transformation roadmap") | Marketing automation against scored leads. Likely needs Mailchimp/Resend. | M | P3 |

---

## Theme 9 — Accessibility & i18n hardening

Required for KSA gov tenders; nice for everyone.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 9.1 | **Keyboard navigation audit** — survey already has 1–9/Enter/Esc; extend to Start (Tab order), Results (focus trap on modals if any added) | A11y baseline. | S | P2 |
| 9.2 | **Screen-reader pass** — add `aria-label` on toggles, `aria-live` on the sync status, alt text on icons | Same. | S | P2 |
| 9.3 | **Color contrast verification** — light theme cream/charcoal needs WCAG AA check, especially `ink-subtle` on `surface-alt` | The current `ink-subtle` may fail AA on cream. | S | **P1** |
| 9.4 | **Reduced-motion preference** — disable any animation when `prefers-reduced-motion` | Cheap to add once we have animations. | S | P3 |

---

## Theme 10 — Operational

Things that prevent silent breakage in prod.

| # | Feature | Why | Effort | Priority |
|---|---|---|---|---|
| 10.1 | **Sentry (or similar) error tracking** in the frontend | Right now we'd never know if a client's browser threw an error mid-survey. | S | **P1** |
| 10.2 | **Plausible / PostHog analytics** — funnel: Start → Survey complete → Save success → Export PDF | Without this we can't see where we lose people. Privacy-respecting options exist. | S | **P1** |
| 10.3 | **Backend health badge** on Settings/About — green/red indicator that pings `/health` | Lets you visually confirm the backend is reachable from the user's network. | S | P2 |
| 10.4 | **Versioning / changelog** in the footer (replace the current step indicator) | Helpful when supporting clients on different deployed versions. | S | P3 |
| 10.5 | **Service-worker update prompt** — "A new version is available, refresh?" | Currently the SW autoUpdates silently; users sometimes get stuck on old versions until they hard-refresh. | S | **P1** |

---

## Recommended sequencing

If we have 1 sprint (1–2 weeks), pick from **P1** items totalling roughly:

**Week 1 — completion + first-impression:**
- 1.1 Progress bar (S)
- 1.2 Auto-save indicator (S)
- 1.5 Resume banner (S)
- 3.1 Hero treatment on Start (S)
- 3.3 Custom radio/checkbox (S)
- 4.1 Mobile bottom nav (S)
- 10.5 SW update prompt (S)
- 10.1 Sentry error tracking (S)

**Week 2 — value of the report:**
- 2.6 ROI playground sliders (S–M)
- 2.8 Spider chart (S)
- 2.1 Branded PDF (M)
- 5.1 Schedule follow-up CTA (S)
- 5.3 Privacy note (S)
- 7.1 AI executive summary (M)
- 8.1 Webhook on complete (S)

That's a believable two-sprint plan that touches funnel completion, perceived deliverable quality, AI proof-of-concept, and basic ops hygiene.

---

## What's deliberately NOT here

- **Multi-tenant accounts / login**: not needed at 10 clients; will be when you hit ~50.
- **Question editor UI**: edit `questions.json` directly until the question bank changes weekly.
- **Custom domain / SSO**: defer until enterprise procurement asks for it.
- **Payments / billing**: this is a sales tool, not a self-serve product (yet).
- **Mobile native app**: PWA is the right call until install conversion data says otherwise.
