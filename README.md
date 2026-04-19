# InfraAI Field Assessment (PWA) — Bundle v2

Mobile-first responsive PWA to run the InfraAI field assessment survey and auto-generate:
- Axis scores (1–5) (aggregate + per-role breakdown)
- Operating DNA labels
- Numeric pain signals
- Top Quick Wins (<=60 days)
- AI opportunities (when readiness allows)
- ROI estimate (configurable)
- PDF export (via print-to-PDF)

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Key files
- `src/questions.json` — survey questions + scoring
- `src/analysis.ts` — scoring + DNA + recommendations + ROI
- `src/App.tsx` — multi-role bundle UI + PDF export

## PDF export
Click **Export PDF** → browser print dialog → choose **Save as PDF**.
