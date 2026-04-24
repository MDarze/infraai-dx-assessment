# UI Rework — Match infraai-dx.com Brand, Desktop-First, Arabic-Primary

**Date:** 2026-04-25
**Scope:** Full visual + UX rework of the field assessment app (option C from brainstorm).
**Reference site:** https://www.infraai-dx.com/ar

## Goals

1. Make the app look and feel like a sibling product of infraai-dx.com — same palette, typography, geometry, and mood — without copying marketing-site whitespace that would hurt form density.
2. Fix five UX pain points: clunky start page, dev-tool question rendering, results-page-as-console, poor mobile/responsive behavior, bolted-on bilingualism.
3. Preserve existing survey logic, scoring, persistence, and backend sync (already patched separately).

## Non-goals

- Changing scoring or analysis logic (`src/analysis.ts`).
- Touching the backend or `syncToBackend` (separate save-bug fix covers that).
- Redesigning per-respondent switching or progress-indicator mechanics (not flagged as pain points).
- Adopting a component library (Radix/shadcn/etc.). Custom primitives only.
- Adding an i18n library; a minimal `t()` helper + two flat dicts is sufficient for ~200 strings.

## Direction

**Derived tool** (not strict marketing sibling): faithful to the brand DNA, but form-optimized layouts instead of editorial whitespace. Looks like "the infraai-dx product", not "the infraai-dx website".

---

## 1. Design Tokens

### Palette

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FAFAF7` | `#0F0F0E` | page background |
| `surface` | `#FFFFFF` | `#1A1A19` | cards, inputs |
| `surface-alt` | `#F3F1EA` | `#2A2A29` | muted panels, hover, table stripes |
| `border` | `#E8E6DF` | `#2A2A29` | 1px hairlines |
| `ink` | `#0F0F0E` | `#FAFAF7` | primary text |
| `ink-muted` | `#5C5C58` | `#8A8A85` | secondary text, labels |
| `ink-subtle` | `#8A8A85` | `#5C5C58` | placeholder, meta |
| `brand` | `#2D5F5D` | `#2D5F5D` | primary accent, CTAs, active, success |
| `brand-ink` | `#FAFAF7` | `#FAFAF7` | text on brand fill |
| `danger` | `#9B2C2C` | `#E05252` | error only |

Monochrome + single teal accent. No emerald/rose/indigo drift.

### Typography

- **Arabic (primary):** IBM Plex Sans Arabic via `@fontsource/ibm-plex-sans-arabic`, weights 400/500/600.
- **Latin (incidental):** Inter via `@fontsource/inter`, 400/500/600.
- **Mono (IDs, emails, numbers):** JetBrains Mono via `@fontsource/jetbrains-mono`, 400.
- Scale: `12 / 14 / 16 / 18 / 22 / 28 / 36`.
- Line-height: `1.6` Arabic body, `1.4` Latin.

### Geometry

- Border radius: **2px** everywhere (cards, inputs, buttons, radios). Pill (`9999px`) reserved for status chips only.
- Borders: 1px hairlines in `border` token. **No box-shadows.** Elevation = border + `surface-alt`.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.

### Direction & numerals

- `<html dir="rtl" lang="ar">` by default; toggled to LTR/en by the locale switch.
- All layouts use Tailwind logical utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`, `text-end`).
- Latin embedded in Arabic (IDs, emails, dates): wrapped in `<span dir="ltr">` with mono font.
- **Western digits** (0–9) throughout, including Arabic contexts. No Arabic-Indic numerals.

---

## 2. Layout System

### App shell (desktop ≥1024px)

- Fixed header, 56px tall, 1px bottom hairline, no shadow.
- Header contents (logical start → end): logo lock-up · project name · [AR | EN] · theme toggle · reset · settings.
- Centered work area, max-width 1120px, 32px page padding.

### Survey step — split pane

- Left rail (240px logical): respondent list + progress count + "add respondent".
- Right pane: active respondent's section header and question cards.

### Breakpoints

- **≥1024px** — full split-pane, header nav inline.
- **768–1023px** — single column; respondent list becomes a sticky accordion above the question area.
- **<768px** — single column; header condenses to icons only; respondent switcher is a bottom sheet.

### Rhythm

- Section spacing: 48px.
- Card padding: 24px.
- Field gap: 16px.

---

## 3. Page Reworks

### 3a. Start page

Two vertical sections — **Company** then **Assessor** — in that order. Fields rendered in a 2-column grid at desktop, collapsing to 1 column below 768px. Labels sit above fields (12px, `ink-muted`), not floating. Inputs: transparent bg, 1px `border`, 12px padding, focus ring in `brand`. Primary CTA: `brand`-filled button, 2px radius, 40px tall.

### 3b. Survey / question rendering

**One question per card.** Long section-scroll is retired.

- Meta row (12px, `ink-subtle`): section name, right-aligned question counter (`سؤال 7 / 24`).
- Question text: 20px, weight 500.
- Options rendered as:
  - **Radio/checkbox questions** — custom 2px-square controls with `brand` fill on selected, 16px option gap, 12px vertical padding per option.
  - **Scale questions (1–5, Likert, etc.)** — segmented control (row of 2px-corner buttons), not a dropdown.
- Optional note field below options.
- Footer: `previous` / `next` buttons. Next becomes `finish` on last question.
- Keyboard shortcuts: `1/2/3/…` to select, `Enter` to advance, `Esc` to unselect.

### 3c. Results page — "report-first, engineering-last"

Ordered top to bottom:

1. **Editorial header** — report title with client name, date to the logical end.
2. **Meta strip** — assessment ID (mono, `dir="ltr"`), saved status as small tag.
3. **Hero row** (two tiles, equal width):
   - Score tile: giant number (`72 / 100`), short label below ("جاهزية متوسطة").
   - Operating DNA tile: type name + bulleted key traits.
4. **ROI stat row** — 4 compact tiles (ratio, SAR savings, payback months, time saved %).
5. **Recommendations** — ordered list, editorial prose, not cards.
6. **Footer actions** — Export PDF, Share, sync status tag.

Sync status moved from prominent top card to inline meta strip + footer tag. On error only, an inline error block appears below the meta strip with a retry button. The retry call path is the already-patched `syncNow(state, { force: true })`.

---

## 4. Localization & RTL

- Replace all inline `"arabic • english"` mashups with a single-locale dictionary.
- `src/i18n/ar.ts` and `src/i18n/en.ts` — two flat objects, dotted keys (`start.title`, `survey.next`, `results.roi.savings`, etc.).
- `src/i18n/t.ts` exports `t(key)` that reads from the active locale; `useLocale()` hook exposes locale + setter.
- No i18n library. YAGNI for ~200 strings.
- Locale persisted under `localStorage.infraai_locale`. Default: `ar`.
- `questions.json` reshaped from current mixed fields to `{ id, ar: { text, options[] }, en: { text, options[] } }`.
- Bilingual inline strings removed throughout. Language switch is in the header only.

**Forced Latin (locale-independent):** assessment IDs, email addresses, numeric values, ISO dates where displayed, the brand string "InfraAI".

---

## 5. Theming (system toggle)

- CSS custom properties for all tokens on `:root`; overrides under `[data-theme="dark"]` on `<html>`.
- Tailwind `darkMode: ['selector', '[data-theme="dark"]']`.
- On first load: read `localStorage.infraai_theme` first, else `prefers-color-scheme`. Apply to `<html>` before React mounts via an inline script in `index.html` (no flash).
- Header toggle cycles `system → light → dark → system`, persisted to `localStorage.infraai_theme`.
- Icons are single-color (`stroke="currentColor"`), so they flip automatically.

---

## 6. Implementation Approach

### Tailwind config

- Replace default color palette with the 11 design tokens (e.g. `bg-surface`, `text-ink-muted`, `border-border`, `bg-brand`).
- Strip unused radius utilities — allow `rounded-[2px]` and `rounded-full` only. Remove any `rounded-xl` / `rounded-2xl` references project-wide.
- Font families: `font-sans` → IBM Plex Sans Arabic stack; `font-mono` → JetBrains Mono.
- `@tailwindcss/forms` plugin with `strategy: 'class'` so only opted-in inputs pick up base styles.

### Component primitives (`src/ui/`)

New files: `Button.tsx`, `Card.tsx`, `Field.tsx`, `Radio.tsx`, `Segmented.tsx`, `Stat.tsx`, `PageHeader.tsx`, `ThemeToggle.tsx`, `LocaleToggle.tsx`. Thin, unstyled-then-styled, no dependency surface.

### Page split

`src/App.tsx` is currently one ~500-line file with all step components inline. Split into:

- `src/pages/Start.tsx`
- `src/pages/Survey.tsx`
- `src/pages/Results.tsx`
- `src/pages/Settings.tsx` (existing settings view)

`App.tsx` retains: state root, step routing, `syncNow` callback, persistence plumbing.

### Fonts

Self-hosted via `@fontsource/ibm-plex-sans-arabic`, `@fontsource/inter`, `@fontsource/jetbrains-mono`. Subset to Arabic + Latin. Estimated bundle impact ~60KB woff2 additions.

### Files changed

- `tailwind.config.js` — full rewrite
- `src/styles.css` — tokens, base, typography layer
- `src/App.tsx` — split into pages, swap all inline bilingual strings for `t()` calls
- `src/storage.ts` — add locale + theme persistence keys
- `src/questions.json` — extend shape per locale
- `index.html` — theme bootstrap script, `<html lang dir>` attrs
- **New:** `src/i18n/{ar,en,t}.ts`, `src/ui/*`, `src/theme.ts`, `src/pages/*`

### Untouched

- `src/analysis.ts` — scoring logic.
- `src/api.ts` — already correct post save-bug fix.
- PWA manifest beyond color updates.
- Backend.

---

## Acceptance Criteria

- Visiting the deployed dashboard shows cream/charcoal/teal palette matching infraai-dx.com at a glance.
- Every visible string is Arabic by default; English appears only when the header locale toggle is set to EN.
- No `"arabic • english"` bilingual mashup strings anywhere.
- Theme toggle works, system preference honored on first load, no flash of wrong theme.
- Survey renders one question per card; keyboard shortcuts `1–9` / `Enter` / `Esc` work.
- Results page opens with score hero + DNA tile side-by-side; sync status is a footer tag unless errored.
- App is usable at desktop (primary), tablet portrait, and phone widths without broken layout.
- `npm run build` succeeds; bundle size increase stays under ~80KB gzipped.
- Existing data model, survey questions, scoring, and backend sync behavior all unchanged.
