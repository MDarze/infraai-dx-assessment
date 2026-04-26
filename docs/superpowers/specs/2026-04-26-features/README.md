# Feature Specs Index — 2026-04-26

Each file in this directory is a self-contained spec for one feature, ready to hand to an implementer (human or agent). The roadmap that organizes these by theme + priority lives at:

→ `docs/superpowers/plans/2026-04-26-product-roadmap.md`

## Structure of each spec

- **Priority / Effort / Theme** — quick triage line
- **Problem** — what's broken or missing
- **Solution** — proposed approach
- **Acceptance criteria** — what "done" looks like
- **Files** — what the implementer will touch
- **Out of scope** — explicit NO list

## Index

### Theme 1 — Survey completion & engagement
- [1.1 Progress bar](1.1-progress-bar.md) — P1 · S
- [1.2 Auto-save indicator](1.2-autosave-indicator.md) — P1 · S
- [1.3 Skip + come back](1.3-skip-and-return.md) — P1 · M
- [1.4 Per-respondent progress](1.4-per-respondent-progress.md) — P2 · S
- [1.5 Resume banner](1.5-resume-banner.md) — P1 · S
- [1.6 Question groups + section nav](1.6-section-nav.md) — P2 · M
- [1.7 Required vs optional marking](1.7-required-optional.md) — P2 · S
- [1.8 Smart defaults](1.8-smart-defaults.md) — P3 · M

### Theme 2 — Results page value
- [2.1 Branded PDF report](2.1-branded-pdf.md) — P1 · M–L
- [2.2 Email report](2.2-email-report.md) — P1 · M
- [2.3 Shareable read-only link](2.3-shareable-link.md) — P2 · M
- [2.4 Industry benchmark comparison](2.4-industry-benchmark.md) — P2 · L
- [2.5 Quick-win prioritization slider](2.5-quickwin-prioritization.md) — P2 · S
- [2.6 ROI playground](2.6-roi-playground.md) — P1 · S–M
- [2.7 "After we engage" projection](2.7-after-engagement-projection.md) — P2 · M
- [2.8 Spider chart](2.8-spider-chart.md) — P1 · S
- [2.9 Per-role drill-down](2.9-per-role-drilldown.md) — P2 · S

### Theme 3 — Branding & visual polish
- [3.1 Hero treatment on Start](3.1-start-hero.md) — P1 · S
- [3.2 Subtle background texture](3.2-background-texture.md) — P2 · S
- [3.3 Custom radio + checkbox](3.3-custom-radio-checkbox.md) — P1 · S
- [3.4 Iconography pass](3.4-iconography.md) — P2 · S
- [3.5 Typographic hierarchy audit](3.5-typography-audit.md) — P2 · S
- [3.6 Empty + loading states](3.6-empty-loading-states.md) — P2 · S
- [3.7 Animated page transitions](3.7-page-transitions.md) — P3 · S
- [3.8 Print stylesheet](3.8-print-stylesheet.md) — P2 · S

### Theme 4 — Mobile & responsive
- [4.1 Mobile bottom nav for Survey](4.1-mobile-bottom-nav.md) — P1 · S
- [4.2 Tablet split-pane](4.2-tablet-split-pane.md) — P2 · M
- [4.3 Swipe gestures](4.3-swipe-gestures.md) — P3 · S
- [4.4 Offline-first verification + queue](4.4-offline-queue.md) — P2 · M

### Theme 5 — Trust & conversion
- [5.1 Schedule follow-up CTA](5.1-schedule-cta.md) — P1 · S
- [5.2 Methodology page](5.2-methodology-page.md) — P2 · S
- [5.3 Privacy / data handling note](5.3-privacy-note.md) — P1 · S
- [5.4 Case studies / social proof](5.4-social-proof.md) — P3 · S
- [5.5 Branded completion confetti](5.5-completion-confetti.md) — P3 · S

### Theme 6 — Backoffice & business intelligence
- [6.1 Assessment list view + filters](6.1-assessment-list-filters.md) — P2 · S–M
- [6.2 Aggregate dashboard](6.2-aggregate-dashboard.md) — P2 · M
- [6.3 Re-assess client (delta view)](6.3-reassess-client.md) — P1 · M
- [6.4 CSV / Excel export](6.4-csv-export.md) — P2 · S
- [6.5 Client portal](6.5-client-portal.md) — P3 · L
- [6.6 Notes & action items](6.6-notes-actions.md) — P3 · M

### Theme 7 — AI / smart features
- [7.1 AI executive summary](7.1-ai-executive-summary.md) — P1 · M
- [7.2 AI-suggested follow-up questions](7.2-followup-questions.md) — P2 · M
- [7.3 Voice-to-text for notes](7.3-voice-to-text.md) — P2 · S
- [7.4 Photo upload per question](7.4-photo-upload.md) — P3 · M
- [7.5 Conversational survey mode](7.5-conversational-mode.md) — P3 · L

### Theme 8 — Integrations & lead-gen
- [8.1 Webhook on assessment complete](8.1-completion-webhook.md) — P1 · S
- [8.2 HubSpot / Pipedrive sync](8.2-crm-sync.md) — P2 · M
- [8.4 Score-based email drip](8.4-email-drip.md) — P3 · M
- _(8.3 Calendar booking covered by 5.1)_

### Theme 9 — Accessibility & i18n hardening
- [9.1 Keyboard navigation audit](9.1-keyboard-nav-audit.md) — P2 · S
- [9.2 Screen-reader pass](9.2-screen-reader.md) — P2 · S
- [9.3 Color contrast verification](9.3-color-contrast.md) — P1 · S
- [9.4 Reduced-motion preference](9.4-reduced-motion.md) — P3 · S

### Theme 10 — Operational
- [10.1 Error tracking (Sentry)](10.1-error-tracking.md) — P1 · S
- [10.2 Funnel analytics](10.2-analytics.md) — P1 · S
- [10.3 Backend health badge](10.3-backend-health-badge.md) — P2 · S
- [10.4 Versioning + changelog](10.4-versioning-changelog.md) — P3 · S
- [10.5 Service-worker update prompt](10.5-sw-update-prompt.md) — P1 · S

---

**P1 count:** 14 specs · **P2 count:** 21 · **P3 count:** 14 · **Total:** 49
