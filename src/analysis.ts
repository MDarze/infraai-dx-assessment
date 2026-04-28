import { AssessmentState, AnswerValue, Dimension, QuestionDef } from "./types";
import { DIMENSIONS } from "./types";
import { questionBank } from "./questionBank";

/** Score per dimension on 0–100 scale (per spec) and 0–5 normalized for radar parity. */
export type DimensionScore = {
  raw: number;          // 0–3 weighted average of answered questions
  pct: number;          // 0–100 (raw / 3 * 100)
  normalized: number;   // 0–5 for radar
  stage: "Initial" | "Developing" | "Defined" | "Optimized";
  answered: number;
  total: number;
};

export type DimensionScores = Record<Dimension, DimensionScore>;

export type DNAProfile = {
  DecisionDNA: string;
  DataDNA: string;
  FinancialDNA: string;
  GovernanceDNA: string;
};

export type AnalysisResult = {
  dimensionScores: DimensionScores;
  overallPct: number;          // 0–100 weighted by dimension weights
  overallStage: DimensionScore["stage"];
  overallNormalized: number;   // 0–5
  dna: DNAProfile;
  qualitativeNotes: { id: string; labelAr: string; labelEn: string; value: string }[];
  quickWins: QuickWin[];
  aiOpportunities: QuickWin[];
  roiEstimate?: ROIEstimate;
};

export type QuickWin = {
  titleAr: string;
  titleEn: string;
  whyAr: string;
  whyEn: string;
  impactAr: string;
  impactEn: string;
};

export type ROIEstimate = {
  weeklyHoursSaved: number;
  weeklyCostSavedSar: number;
  notesAr: string[];
  notesEn: string[];
};

const DNA_DIMENSION_MAP: Record<keyof DNAProfile, Dimension> = {
  DecisionDNA: "executive_management",
  DataDNA: "reporting",
  FinancialDNA: "finance",
  GovernanceDNA: "gov_compliance",
};

function stageFor(pct: number): DimensionScore["stage"] {
  if (pct < 25) return "Initial";
  if (pct < 50) return "Developing";
  if (pct < 75) return "Defined";
  return "Optimized";
}

function scoreAnswer(q: QuestionDef, v: AnswerValue): number | null {
  if (v == null) return null;

  if (q.type === "mcq") {
    const key = String(v);
    const opt = q.options?.find((o) => o.key === key);
    return opt ? opt.score : null;
  }

  if (q.type === "yn_conditional") {
    if (typeof v !== "object" || v === null || !("answer" in v)) return null;
    const base = v.answer === "yes" ? q.yes_score : q.no_score;
    if (base == null) return null;
    if (
      q.follow_up &&
      v.followUp &&
      q.conditional_if &&
      v.answer === q.conditional_if
    ) {
      const opt = q.follow_up.options.find((o) => o.key === v.followUp);
      if (opt) return (base + opt.score) / 2;
    }
    return base;
  }

  // open: assessor scores manually — not auto-scored
  return null;
}

export function analyze(state: AssessmentState): AnalysisResult {
  const sector = state.meta.sector;
  const questions = questionBank.questions.filter(
    (q) => q.sectors.includes("ALL") || q.sectors.includes(sector),
  );

  const byDim: Record<Dimension, { sum: number; count: number; total: number }> = {} as any;
  for (const d of DIMENSIONS) byDim[d] = { sum: 0, count: 0, total: 0 };

  for (const q of questions) {
    if (q.type !== "open") byDim[q.dimension].total += 1;
    const ans = state.answers[q.id];
    const s = scoreAnswer(q, ans);
    if (s != null) {
      byDim[q.dimension].sum += s;
      byDim[q.dimension].count += 1;
    }
  }

  const dimensionScores = {} as DimensionScores;
  for (const d of DIMENSIONS) {
    const { sum, count, total } = byDim[d];
    const raw = count ? sum / count : 0;
    const pct = round((raw / 3) * 100, 1);
    dimensionScores[d] = {
      raw: round(raw, 2),
      pct,
      normalized: round((raw / 3) * 5, 2),
      stage: stageFor(pct),
      answered: count,
      total,
    };
  }

  // Overall = weighted by dimension weights from the bank
  let weightedSum = 0;
  let weightTotal = 0;
  for (const meta of questionBank.dimensions) {
    const ds = dimensionScores[meta.key];
    if (ds.answered > 0) {
      weightedSum += ds.pct * meta.weight;
      weightTotal += meta.weight;
    }
  }
  const overallPct = weightTotal ? round(weightedSum / weightTotal, 1) : 0;
  const overallNormalized = round((overallPct / 100) * 5, 2);

  const dna = computeDna(dimensionScores);

  // Qualitative open-text answers
  const qualitativeNotes: AnalysisResult["qualitativeNotes"] = [];
  for (const q of questions) {
    if (q.type !== "open") continue;
    const v = state.answers[q.id];
    if (typeof v === "string" && v.trim()) {
      qualitativeNotes.push({
        id: q.id,
        labelAr: q.label_ar,
        labelEn: q.label_en,
        value: v.trim(),
      });
    }
  }

  const quickWins = buildQuickWins(dimensionScores);
  const aiOpportunities = buildAiOpportunities(dimensionScores);
  const roiEstimate = buildRoi(state);

  return {
    dimensionScores,
    overallPct,
    overallStage: stageFor(overallPct),
    overallNormalized,
    dna,
    qualitativeNotes,
    quickWins,
    aiOpportunities,
    roiEstimate,
  };
}

function computeDna(s: DimensionScores): DNAProfile {
  const at = (k: keyof DNAProfile) => s[DNA_DIMENSION_MAP[k]].pct;
  return {
    DecisionDNA: at("DecisionDNA") < 50
      ? "Reactive | تفاعلي"
      : "Data-Driven | مبني على بيانات",
    DataDNA: at("DataDNA") < 50
      ? "Fragmented | متشظي"
      : "Unified | موحّد",
    FinancialDNA: at("FinancialDNA") < 50
      ? "Delayed Visibility | رؤية متأخرة"
      : "High Visibility | رؤية جيدة",
    GovernanceDNA: at("GovernanceDNA") < 50
      ? "High Risk | مخاطر عالية"
      : "Controlled | مُدار",
  };
}

function buildQuickWins(s: DimensionScores): QuickWin[] {
  const wins: QuickWin[] = [];
  if (s.reporting.pct > 0 && s.reporting.pct < 50) {
    wins.push({
      titleAr: "قالب تقرير يومي موحّد + سجل مركزي بدل واتس/ملفات متعددة",
      titleEn: "Standard daily report + central log",
      whyAr: "تقليل فوضى النسخ وتضارب البيانات وتسريع الوصول للمعلومة.",
      whyEn: "Reduce duplicate copies/data conflicts and speed up visibility.",
      impactAr: "خفض وقت التجميع وإعادة الإدخال خلال 2–3 أسابيع.",
      impactEn: "Reduce collection & re-entry time within 2–3 weeks.",
    });
  }
  if (s.finance.pct > 0 && s.finance.pct < 50) {
    wins.push({
      titleAr: "Dashboard بسيط: تقدم التنفيذ مقابل المصروفات (Cost vs Progress)",
      titleEn: "Simple dashboard: Cost vs Progress",
      whyAr: "الانحراف المالي يظهر متأخرًا؛ الربط يكتشفه مبكرًا.",
      whyEn: "Variance is detected late; linking makes it early.",
      impactAr: "تقليل Overrun وتحسين التنبؤ بالمصروفات.",
      impactEn: "Reduce overruns and improve forecasting.",
    });
  }
  if (s.gov_compliance.pct > 0 && s.gov_compliance.pct < 50) {
    wins.push({
      titleAr: "مستودع مستندات موحّد + Checklist امتثال للجهات الحكومية/العميل",
      titleEn: "Document hub + compliance checklist",
      whyAr: "تقليل زمن تجميع المستندات وتقليل مخاطر النقص أثناء التدقيق.",
      whyEn: "Speed up document compilation and reduce audit gaps.",
      impactAr: "تقليل زمن تجهيز المستندات وتقليل مخاطر الغرامات/التأخير.",
      impactEn: "Faster document readiness + lower penalties/delay risk.",
    });
  }
  if (s.executive_management.pct > 0 && s.executive_management.pct < 50) {
    wins.push({
      titleAr: "لوحة مؤشرات أسبوعية ثابتة + قواعد إنذار مبكر",
      titleEn: "Weekly KPI board + early warning rules",
      whyAr: "تأخر القرار غالبًا نتيجة نقص/تأخر البيانات.",
      whyEn: "Decision delay often comes from late/incomplete data.",
      impactAr: "قرارات أسرع (1–2 يوم بدل 3+).",
      impactEn: "Faster decisions (1–2 days instead of 3+).",
    });
  }
  if (s.site_management.pct > 0 && s.site_management.pct < 50) {
    wins.push({
      titleAr: "تطبيق موبايل ميداني للتحديثات اليومية والصور",
      titleEn: "Field mobile app for daily updates and photos",
      whyAr: "تحويل التحديثات الورقية/الواتس لبيانات منظمة.",
      whyEn: "Convert paper/WhatsApp updates into structured data.",
      impactAr: "تقليل ازدواج الإدخال وتسريع رؤية الموقع.",
      impactEn: "Cut duplicate entry and accelerate site visibility.",
    });
  }
  return wins;
}

function buildAiOpportunities(s: DimensionScores): QuickWin[] {
  const ops: QuickWin[] = [];
  const dataReady = s.reporting.pct >= 50 && s.operations.pct >= 50;

  if (dataReady && s.reporting.pct < 75) {
    ops.push({
      titleAr: "AI تلخيص تلقائي للتقارير اليومية (صور + نقاط + مخاطر)",
      titleEn: "AI auto-summaries for daily reports",
      whyAr: "تقليل وقت كتابة/تلخيص التقارير وتوحيد اللغة.",
      whyEn: "Reduce writing/summarization time and standardize language.",
      impactAr: "خفض 30–60% من وقت التقارير حسب كثافة العمل.",
      impactEn: "Cut reporting time by 30–60% depending on workload.",
    });
  }
  if (dataReady && (s.finance.pct < 75 || s.executive_management.pct < 75)) {
    ops.push({
      titleAr: "AI تنبيهات استباقية (توقع تأخير/اختناق قبل حدوثه)",
      titleEn: "AI predictive alerts (delay/bottleneck prediction)",
      whyAr: "تحويل القرار من تفاعلي إلى وقائي.",
      whyEn: "Shift from reactive to preventive decisions.",
      impactAr: "تقليل التأخير والمفاجآت التشغيلية.",
      impactEn: "Reduce delays and operational surprises.",
    });
  }
  if (dataReady && s.gov_compliance.pct < 75) {
    ops.push({
      titleAr: "AI تدقيق مستندات الامتثال (اكتمال/تعارض/نقص)",
      titleEn: "AI compliance document validation",
      whyAr: "تقليل وقت المراجعة اليدوية وتقليل المخاطر.",
      whyEn: "Reduce manual review and compliance risk.",
      impactAr: "تسريع ملفات الزكاة/المطالبات وتقليل مخاطر التدقيق.",
      impactEn: "Faster Zakat/claims files and lower audit risk.",
    });
  }
  return ops;
}

function buildRoi(state: AssessmentState): ROIEstimate | undefined {
  const { engineersCount, workingDaysPerWeek, timeSavingRate, avgHourCostSar, dailyReportingHours } =
    state.roi;

  if (!dailyReportingHours || !avgHourCostSar) return undefined;

  const engineers = Math.max(1, engineersCount);
  const days = clamp(workingDaysPerWeek, 1, 7);
  const rate = clamp(timeSavingRate, 0, 0.9);

  const weeklyHoursLost = dailyReportingHours * days * engineers;
  const weeklyHoursSaved = weeklyHoursLost * rate;
  const weeklyCostSavedSar = weeklyHoursSaved * avgHourCostSar;

  return {
    weeklyHoursSaved: round(weeklyHoursSaved, 1),
    weeklyCostSavedSar: round(weeklyCostSavedSar, 0),
    notesAr: [
      `افتراض: عدد المهندسين = ${engineers} | أيام/أسبوع = ${days} | نسبة التوفير = ${(rate * 100).toFixed(0)}%`,
      "تقدير أولي قابل للتحسين بعد جمع بيانات أكثر.",
    ],
    notesEn: [
      `Assumptions: Engineers = ${engineers} | Days/week = ${days} | Saving rate = ${(rate * 100).toFixed(0)}%`,
      "Early estimate; refine after more data.",
    ],
  };
}

function round(n: number, d: number) {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
