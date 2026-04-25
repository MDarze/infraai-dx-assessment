import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Stat } from "../ui/Stat";
import { axisLabel, roleLabel, roleLabelEn } from "../pageHelpers";
import { hasBackend } from "../api";
import { t } from "../i18n/t";
import { useLocale } from "../i18n/useLocale";

const overallScore = (axisScores: Record<string, number>): number | null => {
  const vals = Object.values(axisScores).filter((v) => v > 0);
  if (!vals.length) return null;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(avg * 20);
};

const pickLocale = (s: string | undefined, ar: boolean): string => {
  if (!s) return "";
  const parts = s.split("|").map((p) => p.trim());
  if (parts.length < 2) return s;
  return ar ? (parts[1] || parts[0]) : (parts[0] || parts[1]);
};

export function Results({ state, result, onBack, onExportPdf, onRetrySync }: any) {
  const sync = state.sync;
  const [locale] = useLocale();
  const ar = locale === "ar";
  const dir: "rtl" | "ltr" = ar ? "rtl" : "ltr";

  const score = overallScore(result.axisScores);
  const dnaEntries = Object.entries(result.dna ?? {}) as [string, string][];

  const syncTag =
    !hasBackend()
      ? null
      : sync?.status === "ok"
      ? { text: t("results.meta.saved"), tone: "brand" as const }
      : sync?.status === "pending"
      ? { text: `${t("results.meta.saving")}…`, tone: "muted" as const }
      : sync?.status === "error"
      ? { text: t("results.meta.saveFailed"), tone: "danger" as const }
      : null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-ink">{t("results.report.title")}</h1>
        <div className="mt-2 text-base text-ink-muted">{state.meta.clientName}</div>
      </header>

      <div className="flex flex-wrap items-center gap-4 border-y border-border py-3 text-sm">
        {sync?.assessmentId && (
          <div className="flex items-center gap-2">
            <span className="text-ink-muted">{t("results.meta.assessmentId")}:</span>
            <span className="mono text-ink">{sync.assessmentId}</span>
          </div>
        )}
        <div className="text-ink-muted">
          {new Date(state.meta.createdAt).toLocaleString(ar ? "ar-SA" : "en-US")}
        </div>
        <div className="ms-auto">
          {syncTag && (
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                syncTag.tone === "brand"
                  ? "bg-brand/10 text-brand"
                  : syncTag.tone === "danger"
                  ? "bg-danger/10 text-danger"
                  : "bg-surface-alt text-ink-muted"
              }`}
            >
              {syncTag.text}
            </span>
          )}
          {!hasBackend() && (
            <span className="rounded-full px-3 py-1 text-xs bg-danger/10 text-danger">
              {t("results.sync.notConfigured")}
            </span>
          )}
        </div>
      </div>

      {sync?.status === "error" && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-danger" dir="ltr">{sync.error}</div>
            <Button variant="secondary" size="sm" onClick={onRetrySync}>
              {t("results.actions.retry")}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="mono text-5xl font-semibold text-ink">
            {score ?? "—"}
            <span className="text-xl text-ink-subtle"> / 100</span>
          </div>
          <div className="mt-2 text-sm text-ink-muted">{t("results.hero.score")}</div>
        </Card>

        <Card title={t("results.section.dna")}>
          <ul className="space-y-2 text-sm">
            {dnaEntries.map(([k, v]) => (
              <li key={k}>
                <div className="text-xs text-ink-subtle mono">{k}</div>
                <div className="font-medium text-ink" dir={dir}>{pickLocale(v, ar)}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {result.roiEstimate && (
        <section>
          <h2 className="mb-3 text-xl font-semibold text-ink">{t("results.section.roi")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Stat
              value={`${result.roiEstimate.weeklyCostSavedSar} SAR`}
              label={t("results.roi.weekly")}
              emphasis
            />
            <Stat
              value={String(result.roiEstimate.weeklyHoursSaved)}
              label={t("results.roi.weeklyHours", { n: result.roiEstimate.weeklyHoursSaved })}
            />
          </div>
          <ul className="mt-3 list-disc ps-5 space-y-1 text-xs text-ink-muted" dir={dir}>
            {(ar ? result.roiEstimate.notesAr : result.roiEstimate.notesEn).map(
              (n: string, i: number) => <li key={i}>{n}</li>
            )}
          </ul>
        </section>
      )}

      {!result.roiEstimate && (
        <Card title={t("results.section.roi")}>
          <div className="text-sm text-ink-muted">{t("results.roi.empty")}</div>
        </Card>
      )}

      <Card title={t("results.section.axisScores")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(result.axisScores).map(([k, v]: any) => (
            <Stat key={k} value={Number(v).toFixed(2)} label={axisLabel(k)} />
          ))}
        </div>
      </Card>

      {result.painSignals.length > 0 && (
        <Card title={t("results.section.painSignals")}>
          <ul className="space-y-2 text-sm">
            {result.painSignals.map((p: any) => (
              <li key={p.key} className="rounded-[2px] border border-border bg-surface-alt p-3">
                <div className="text-ink" dir={dir}>{ar ? p.labelAr : p.labelEn}</div>
                <div className="font-semibold mt-1 mono text-ink">{p.value}</div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {result.quickWins.length > 0 && (
        <Card title={t("results.section.quickWins")}>
          <ol className="space-y-3 list-decimal ps-5">
            {result.quickWins.map((w: any, i: number) => (
              <li key={i} dir={dir}>
                <div className="font-medium text-ink">{ar ? w.titleAr : w.titleEn}</div>
                <div className="text-xs text-ink-muted mt-1">{ar ? w.whyAr : w.whyEn}</div>
                <div className="text-xs text-brand mt-1">
                  {t("results.impact")}: {ar ? w.impactAr : w.impactEn}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {result.aiOpportunities.length > 0 && (
        <Card title={t("results.section.aiOpportunities")}>
          <ol className="space-y-3 list-decimal ps-5">
            {result.aiOpportunities.map((a: any, i: number) => (
              <li key={i} dir={dir}>
                <div className="font-medium text-ink">{ar ? a.titleAr : a.titleEn}</div>
                <div className="text-xs text-ink-muted mt-1">{ar ? a.whyAr : a.whyEn}</div>
                <div className="text-xs text-brand mt-1">
                  {t("results.impact")}: {ar ? a.impactAr : a.impactEn}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {!result.aiOpportunities.length && (
        <Card title={t("results.section.aiOpportunities")}>
          <div className="text-sm text-ink-muted">{t("results.aiOpportunities.empty")}</div>
        </Card>
      )}

      <footer className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button variant="primary" onClick={onExportPdf}>
          {t("results.actions.exportPdf")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const blob = new Blob([JSON.stringify({ state, result }, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `infraai-assessment-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          {t("results.actions.exportJson")}
        </Button>
        <Button variant="ghost" onClick={onBack}>
          {t("header.back")}
        </Button>
      </footer>
    </div>
  );
}

export function exportPdf(state: any, result: any) {
  const html = buildPrintableHtml(state, result);
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function buildPrintableHtml(state: any, result: any) {
  const axisRows = Object.entries(result.axisScores).map(([k, v]: any) => `
    <tr><td>${axisLabel(k)}</td><td style="text-align:center">${Number(v).toFixed(2)}</td></tr>
  `).join("");

  const byRole = Object.entries(result.axisScoresByRole).map(([role, scores]: any) => {
    const rows = Object.entries(scores).map(([k, v]: any) => `
      <tr><td>${axisLabel(k)}</td><td style="text-align:center">${Number(v).toFixed(2)}</td></tr>
    `).join("");
    return `
      <div class="box">
        <h3>${roleLabel(role)} <span class="muted">| ${roleLabelEn(role)}</span></h3>
        <table><thead><tr><th>Axis</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table>
      </div>
    `;
  }).join("");

  const quickWins = result.quickWins.map((w: any) => `
    <div class="box">
      <h3>${w.titleAr}</h3>
      <div class="muted">${w.whyAr}</div>
      <div class="impact">Impact: ${w.impactAr}</div>
      <hr/>
      <div dir="ltr">
        <h3>${w.titleEn}</h3>
        <div class="muted">${w.whyEn}</div>
        <div class="impact">Impact: ${w.impactEn}</div>
      </div>
    </div>
  `).join("");

  const ai = result.aiOpportunities.map((a: any) => `
    <div class="box">
      <h3>${a.titleAr}</h3>
      <div class="muted">${a.whyAr}</div>
      <div class="impact">Impact: ${a.impactAr}</div>
      <hr/>
      <div dir="ltr">
        <h3>${a.titleEn}</h3>
        <div class="muted">${a.whyEn}</div>
        <div class="impact">Impact: ${a.impactEn}</div>
      </div>
    </div>
  `).join("");

  const pain = (result.painSignals ?? []).map((p: any) => `
    <div class="box">
      <div><b>${p.labelAr}</b></div>
      <div class="muted" dir="ltr">${p.labelEn}</div>
      <div class="impact">${p.value}</div>
    </div>
  `).join("");

  const dna = Object.entries(result.dna).map(([k, v]: any) => `<li><b>${k}:</b> ${v}</li>`).join("");

  const roi = result.roiEstimate ? `
    <div class="box">
      <h3>ROI تقديري | Estimated ROI</h3>
      <div class="kpi">${result.roiEstimate.weeklyCostSavedSar} SAR/week</div>
      <div class="muted">${result.roiEstimate.weeklyHoursSaved} hours/week</div>
      <div class="cols">
        <ul>${result.roiEstimate.notesAr.map((n: string) => `<li>${n}</li>`).join("")}</ul>
        <ul dir="ltr">${result.roiEstimate.notesEn.map((n: string) => `<li>${n}</li>`).join("")}</ul>
      </div>
    </div>
  ` : "";

  return `
  <!doctype html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InfraAI Assessment Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color:#0b1220; }
      .hdr { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
      .brand { font-weight:700; font-size:18px; }
      .muted { color:#4b5563; font-size:12px; }
      .box { border:1px solid #e5e7eb; border-radius:12px; padding:12px; margin:12px 0; }
      table { width:100%; border-collapse:collapse; }
      th, td { border-bottom:1px solid #e5e7eb; padding:8px; font-size:12px; }
      th { background:#f9fafb; text-align:right; }
      .impact { color:#0ea5e9; font-size:12px; margin-top:6px; }
      .kpi { font-size:22px; font-weight:800; margin-top:6px; }
      hr { border:none; border-top:1px solid #e5e7eb; margin:10px 0; }
      .cols { display:grid; grid-template-columns: 1fr 1fr; gap:10px; }
      @media print {
        body { margin: 10mm; }
        .box { break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <div class="hdr">
      <div>
        <div class="brand">InfraAI Field Assessment Report</div>
        <div class="muted">تشخيص تشغيلي + خارطة تحول رقمي + فرص AI | Operational diagnosis + transformation blueprint + AI opportunities</div>
      </div>
      <div class="muted" dir="ltr">
        ${new Date(state.meta.createdAt).toLocaleString("en-US")}
      </div>
    </div>

    <div class="box">
      <div><b>العميل | Client:</b> ${state.meta.clientName}</div>
      <div><b>المشروع | Project:</b> ${state.meta.projectName || "-"}</div>
      <div><b>المقيم | Assessor:</b> ${state.meta.assessorName}</div>
      <div><b>الأدوار | Roles:</b> ${state.respondents.map((r: any) => roleLabel(r.role)).join("، ")}</div>
    </div>

    <div class="box">
      <h3>Operating DNA</h3>
      <ul>${dna}</ul>
    </div>

    <div class="box">
      <h3>Axis Scores (Aggregate)</h3>
      <table><thead><tr><th>Axis</th><th style="text-align:center">Score</th></tr></thead><tbody>${axisRows}</tbody></table>
    </div>

    <div class="box">
      <h3>Axis Scores by Role</h3>
      ${byRole}
    </div>

    <div class="box">
      <h3>Numeric Pain Signals</h3>
      ${pain || "<div class='muted'>No numeric inputs captured.</div>"}
    </div>

    <div class="box">
      <h3>Top Quick Wins (60 days)</h3>
      ${quickWins || "<div class='muted'>No quick wins generated.</div>"}
    </div>

    <div class="box">
      <h3>AI Opportunities</h3>
      ${ai || "<div class='muted'>AI opportunities not triggered (readiness/data).</div>"}
    </div>

    ${roi}

    <div class="muted" style="margin-top:16px;">
      Generated by InfraAI MVP • This report is an initial diagnostic for market entry (first 10 clients).
    </div>
  </body>
  </html>
  `;
}
