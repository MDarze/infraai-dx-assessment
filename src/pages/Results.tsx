import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Stat } from "../ui/Stat";
import { axisLabel, roleLabel, roleLabelEn } from "../pageHelpers";
import { hasBackend } from "../api";
import { t } from "../i18n/t";
import { useLocale } from "../i18n/useLocale";

export function Results({ state, result, onBack, onExportPdf, onRetrySync }: any) {
  const sync = state.sync;
  const [locale] = useLocale();
  const ar = locale === "ar";
  const dir: "rtl" | "ltr" = ar ? "rtl" : "ltr";

  return (
    <div className="space-y-6">
      <Card title={t("results.section.sync")}>
        {!hasBackend() && (
          <div className="text-sm text-danger">{t("results.sync.notConfigured")}</div>
        )}
        {hasBackend() && sync?.status === "pending" && (
          <div className="text-sm text-ink-muted">{t("results.meta.saving")}…</div>
        )}
        {hasBackend() && sync?.status === "ok" && (
          <div className="text-sm text-brand">
            {t("results.meta.saved")}{" "}
            <span className="text-xs text-ink-subtle mono">(id: {sync.assessmentId})</span>
          </div>
        )}
        {hasBackend() && sync?.status === "error" && (
          <div className="space-y-2">
            <div className="text-sm text-danger" dir="ltr">
              {t("results.meta.saveFailed")}: {sync.error}
            </div>
            <Button variant="secondary" size="sm" onClick={onRetrySync}>
              {t("results.actions.retry")}
            </Button>
          </div>
        )}
        {hasBackend() && !sync && (
          <Button variant="secondary" size="sm" onClick={onRetrySync}>
            {t("results.sync.syncNow")}
          </Button>
        )}
      </Card>

      <Card title={t("results.section.summary")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-ink">
          <div>
            <span className="text-ink-muted">{t("results.summary.client")}:</span>{" "}
            {state.meta.clientName}
          </div>
          <div>
            <span className="text-ink-muted">{t("results.summary.assessor")}:</span>{" "}
            {state.meta.assessorName}
          </div>
          <div>
            <span className="text-ink-muted">{t("results.summary.date")}:</span>{" "}
            {new Date(state.meta.createdAt).toLocaleString(ar ? "ar-SA" : "en-US")}
          </div>
          <div>
            <span className="text-ink-muted">{t("results.summary.roles")}:</span>{" "}
            {state.respondents.map((r: any) => roleLabel(r.role)).join(ar ? "، " : ", ")}
          </div>
        </div>
      </Card>

      <Card title={t("results.section.dna")}>
        <ul className="space-y-2 text-sm">
          {Object.entries(result.dna).map(([k, v]: any) => (
            <li key={k} className="rounded-[2px] border border-border bg-surface-alt p-3">
              <div className="text-xs text-ink-subtle">{k}</div>
              <div className="font-semibold text-ink">{v}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t("results.section.axisScores")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(result.axisScores).map(([k, v]: any) => (
            <Stat key={k} value={Number(v).toFixed(2)} label={axisLabel(k)} />
          ))}
        </div>
      </Card>

      <Card title={t("results.section.painSignals")}>
        {result.painSignals.length ? (
          <ul className="space-y-2 text-sm">
            {result.painSignals.map((p: any) => (
              <li key={p.key} className="rounded-[2px] border border-border bg-surface-alt p-3">
                <div className="text-ink" dir={dir}>{ar ? p.labelAr : p.labelEn}</div>
                <div className="font-semibold mt-1 mono text-ink">{p.value}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-ink-muted">{t("results.painSignals.empty")}</div>
        )}
      </Card>

      <Card title={t("results.section.quickWins")}>
        <div className="space-y-2">
          {result.quickWins.map((w: any, i: number) => (
            <div key={i} className="rounded-[2px] border border-border bg-surface-alt p-3" dir={dir}>
              <div className="font-semibold text-ink">{ar ? w.titleAr : w.titleEn}</div>
              <div className="text-xs text-ink-muted mt-1">{ar ? w.whyAr : w.whyEn}</div>
              <div className="text-xs text-brand mt-2">
                {t("results.impact")}: {ar ? w.impactAr : w.impactEn}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={t("results.section.aiOpportunities")}>
        <div className="space-y-2">
          {result.aiOpportunities.map((a: any, i: number) => (
            <div key={i} className="rounded-[2px] border border-border bg-surface-alt p-3" dir={dir}>
              <div className="font-semibold text-ink">{ar ? a.titleAr : a.titleEn}</div>
              <div className="text-xs text-ink-muted mt-1">{ar ? a.whyAr : a.whyEn}</div>
              <div className="text-xs text-brand mt-2">
                {t("results.impact")}: {ar ? a.impactAr : a.impactEn}
              </div>
            </div>
          ))}
          {!result.aiOpportunities.length && (
            <div className="text-sm text-ink-muted">{t("results.aiOpportunities.empty")}</div>
          )}
        </div>
      </Card>

      <Card title={t("results.section.roi")}>
        {result.roiEstimate ? (
          <div className="text-sm space-y-3">
            <div className="rounded-[2px] border border-border bg-surface-alt p-3">
              <div className="text-ink-subtle text-xs">{t("results.roi.weekly")}</div>
              <div className="text-2xl font-semibold mono text-ink mt-1">
                {result.roiEstimate.weeklyCostSavedSar} SAR/week
              </div>
              <div className="text-xs text-ink-muted mt-1">
                {t("results.roi.weeklyHours", { n: result.roiEstimate.weeklyHoursSaved })}
              </div>
            </div>
            <ul className="list-disc ps-5 space-y-1 text-xs text-ink-muted" dir={dir}>
              {(ar ? result.roiEstimate.notesAr : result.roiEstimate.notesEn).map(
                (n: string, i: number) => <li key={i}>{n}</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="text-sm text-ink-muted">{t("results.roi.empty")}</div>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          {t("header.back")}
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
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
        <Button variant="primary" className="flex-1" onClick={onExportPdf}>
          {t("results.actions.exportPdf")}
        </Button>
      </div>
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
