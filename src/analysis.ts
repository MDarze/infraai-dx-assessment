import { Axis, AssessmentState, QuestionDef, AnswerValue, Role } from "./types";

export type AxisScores = Record<Axis, number>;
export type DNAProfile = {
  DecisionDNA: string;
  DataDNA: string;
  FinancialDNA: string;
  GovernanceDNA: string;
};

export type AnalysisResult = {
  axisScores: AxisScores;
  axisScoresByRole: Record<Role, AxisScores>;
  dna: DNAProfile;
  painSignals: { key: string; labelAr: string; labelEn: string; value: string }[];
  quickWins: { titleAr: string; titleEn: string; whyAr: string; whyEn: string; impactAr: string; impactEn: string }[];
  aiOpportunities: { titleAr: string; titleEn: string; whyAr: string; whyEn: string; impactAr: string; impactEn: string }[];
  roiEstimate?: { weeklyHoursSaved: number; weeklyCostSavedSar: number; notesAr: string[]; notesEn: string[] };
};

const AXES: Axis[] = ["Process","DailyOps","Data","Finance","Governance","Decision","Automation","AIReadiness"];

export function analyze(questions: QuestionDef[], state: AssessmentState): AnalysisResult {
  const qById = new Map(questions.map(q => [q.id, q]));

  const scoreOne = (answers: Record<string, AnswerValue>) => {
    const axisTotals: Record<string, { sum: number; w: number }> = {};
    AXES.forEach(a => axisTotals[a] = { sum: 0, w: 0 });

    const scoreAnswer = (q: QuestionDef, v: AnswerValue): number | null => {
      if (v == null) return null;
      if (q.type === "number" || q.type === "text") return null;

      const optScore = (key: string) => q.options?.find(o => o.key === key)?.score;

      if (q.type === "single") {
        const key = String(v);
        const s = optScore(key) ?? q.scoringMap?.[key];
        return typeof s === "number" ? s : null;
      }

      if (q.type === "multi") {
        const arr = Array.isArray(v) ? v : [];
        const scores = arr
          .map(k => optScore(String(k)) ?? q.scoringMap?.[String(k)])
          .filter((x): x is number => typeof x === "number");
        if (!scores.length) return null;
        return scores.reduce((a,b)=>a+b,0) / scores.length;
      }

      return null;
    };

    for (const [qid, ans] of Object.entries(answers)) {
      const q = qById.get(qid);
      if (!q) continue;
      const s = scoreAnswer(q, ans);
      if (typeof s === "number") {
        const w = q.weight ?? 1;
        axisTotals[q.axis].sum += s * w;
        axisTotals[q.axis].w += w;
      }
    }

    const axisScores = {} as AxisScores;
    for (const a of AXES) {
      axisScores[a] = axisTotals[a].w ? round(axisTotals[a].sum / axisTotals[a].w, 2) : 0;
    }
    return axisScores;
  };

  // per-role scoring
  const axisScoresByRole = {} as Record<Role, AxisScores>;
  const roles = ["Manager","Engineer","Finance","Operations"] as Role[];
  for (const r of roles) {
    const resp = state.respondents.find(x => x.role === r);
    axisScoresByRole[r] = resp ? scoreOne(resp.answers) : emptyScores();
  }

  // aggregate: average across roles that have non-zero scores
  const axisScores = emptyScores();
  for (const a of AXES) {
    const vals = roles
      .map(r => axisScoresByRole[r][a])
      .filter(v => v > 0);
    axisScores[a] = vals.length ? round(vals.reduce((x,y)=>x+y,0) / vals.length, 2) : 0;
  }

  const dna: DNAProfile = {
    DecisionDNA: axisScores.Decision < 3 ? "Reactive | تفاعلي" : "Data-Driven | مبني على بيانات",
    DataDNA: axisScores.Data < 3 ? "Fragmented | متشظي" : "Unified | موحّد",
    FinancialDNA: axisScores.Finance < 3 ? "Delayed Visibility | رؤية متأخرة" : "High Visibility | رؤية جيدة",
    GovernanceDNA: axisScores.Governance < 3 ? "High Risk | مخاطر عالية" : "Controlled | مُدار"
  };

  // Pain signals (use Engineer + Finance numeric inputs)
  const painSignals: AnalysisResult["painSignals"] = [];
  const engineer = state.respondents.find(r => r.role === "Engineer");
  const finance = state.respondents.find(r => r.role === "Finance");

  const dailyHours = num(engineer?.answers["B3_report_time_hours"]);
  if (dailyHours != null) painSignals.push({
    key: "daily_report_hours",
    labelAr: "ساعات يومية (تقارير/تجميع/تحديثات) لمهندس الموقع",
    labelEn: "Daily hours (reporting/collecting updates) for site engineer",
    value: `${dailyHours} h/day`
  });

  const costHourFromAnswer = num(finance?.answers["D4_cost_hour_sar"]);
  const costHour = state.roi.avgHourCostSar ?? costHourFromAnswer ?? null;
  if (costHour != null) painSignals.push({
    key: "hour_cost",
    labelAr: "تكلفة ساعة العمل (تقديري)",
    labelEn: "Hourly cost (estimate)",
    value: `${costHour} SAR/hour`
  });

  // Rules helpers
  const getAny = (qid: string) => {
    for (const r of state.respondents) {
      if (qid in r.answers) return r.answers[qid];
    }
    return null;
  };

  const usesWhatsApp = getAny("B1_daily_updates") === "whatsapp" || getAny("C1_data_path") === "whatsapp_excel";
  const duplicateHigh = getAny("B2_duplicate_entry") === "5plus";
  const financialLate = axisScores.Finance > 0 && axisScores.Finance < 3;
  const governanceRisk = axisScores.Governance > 0 && axisScores.Governance < 3;
  const decisionLate = axisScores.Decision > 0 && axisScores.Decision < 3;

  const quickWins: AnalysisResult["quickWins"] = [];
  const aiOpportunities: AnalysisResult["aiOpportunities"] = [];

  if (usesWhatsApp || duplicateHigh || axisScores.Data < 3) {
    quickWins.push({
      titleAr: "قالب تقرير يومي موحّد + سجل مركزي بدل واتس/ملفات متعددة",
      titleEn: "Standard daily report + central log (replace WhatsApp/file chaos)",
      whyAr: "تقليل فوضى النسخ وتضارب البيانات + تسريع الوصول للمعلومة.",
      whyEn: "Reduce duplicate copies/data conflicts and speed up visibility.",
      impactAr: "خفض وقت التجميع وإعادة الإدخال خلال 2–3 أسابيع.",
      impactEn: "Reduce collection & re-entry time within 2–3 weeks."
    });
  }
  if (financialLate) {
    quickWins.push({
      titleAr: "Dashboard بسيط: تقدم التنفيذ مقابل المصروفات (Cost vs Progress)",
      titleEn: "Simple dashboard: Cost vs Progress",
      whyAr: "الانحراف المالي يظهر متأخرًا؛ الربط يكتشفه مبكرًا.",
      whyEn: "Variance is detected late; linking makes it early.",
      impactAr: "تقليل Overrun وتحسين التنبؤ بالمصروفات.",
      impactEn: "Reduce overruns and improve forecasting."
    });
  }
  if (governanceRisk) {
    quickWins.push({
      titleAr: "مستودع مستندات موحّد + Checklist امتثال للجهات الحكومية/العميل",
      titleEn: "Document hub + compliance checklist",
      whyAr: "تقليل زمن تجميع المستندات وتقليل مخاطر النقص أثناء التدقيق.",
      whyEn: "Speed up document compilation and reduce audit gaps.",
      impactAr: "تقليل زمن تجهيز المستندات + تقليل مخاطر الغرامات/التأخير.",
      impactEn: "Faster document readiness + lower penalties/delay risk."
    });
  }
  if (decisionLate) {
    quickWins.push({
      titleAr: "لوحة مؤشرات أسبوعية ثابتة + قواعد إنذار مبكر",
      titleEn: "Weekly KPI board + early warning rules",
      whyAr: "تأخر القرار غالبًا نتيجة نقص/تأخر البيانات.",
      whyEn: "Decision delay often comes from late/incomplete data.",
      impactAr: "قرارات أسرع (1–2 يوم بدل 3+).",
      impactEn: "Faster decisions (1–2 days instead of 3+)."
    });
  }

  // AI readiness rule
  const aiReady = axisScores.AIReadiness >= 3 && axisScores.Data >= 2;
  if (aiReady && dailyHours != null && dailyHours >= 2) {
    aiOpportunities.push({
      titleAr: "AI تلخيص تلقائي للتقارير اليومية (صور + نقاط + مخاطر)",
      titleEn: "AI auto-summaries for daily reports (photos + bullets + risks)",
      whyAr: "تقليل وقت كتابة/تلخيص التقارير وتوحيد اللغة.",
      whyEn: "Reduce writing/summarization time and standardize language.",
      impactAr: "خفض 30–60% من وقت التقارير حسب كثافة العمل.",
      impactEn: "Cut reporting time by 30–60% depending on workload."
    });
  }
  if (aiReady && (financialLate || decisionLate)) {
    aiOpportunities.push({
      titleAr: "AI تنبيهات استباقية (توقع تأخير/اختناق قبل حدوثه)",
      titleEn: "AI predictive alerts (delay/bottleneck before it happens)",
      whyAr: "تحويل القرار من تفاعلي إلى وقائي.",
      whyEn: "Shift from reactive to preventive decisions.",
      impactAr: "تقليل التأخير والمفاجآت التشغيلية.",
      impactEn: "Reduce delays and operational surprises."
    });
  }
  if (aiReady && governanceRisk) {
    aiOpportunities.push({
      titleAr: "AI تدقيق مستندات الامتثال (اكتمال/تعارض/نقص)",
      titleEn: "AI compliance document validation (completeness/conflicts)",
      whyAr: "تقليل وقت المراجعة اليدوية وتقليل المخاطر.",
      whyEn: "Reduce manual review and compliance risk.",
      impactAr: "تسريع ملفات الزكاة/المطالبات وتقليل مخاطر التدقيق.",
      impactEn: "Faster Zakat/claims files and lower audit risk."
    });
  }

  // ROI estimate based on settings (and available inputs)
  let roiEstimate: AnalysisResult["roiEstimate"] = undefined;
  if (dailyHours != null && costHour != null) {
    const engineers = Math.max(1, state.roi.engineersCount);
    const days = clamp(state.roi.workingDaysPerWeek, 1, 7);
    const rate = clamp(state.roi.timeSavingRate, 0, 0.9);

    const weeklyHoursLost = dailyHours * days * engineers;
    const weeklyHoursSaved = weeklyHoursLost * rate;
    const weeklyCostSavedSar = weeklyHoursSaved * costHour;

    roiEstimate = {
      weeklyHoursSaved: round(weeklyHoursSaved, 1),
      weeklyCostSavedSar: round(weeklyCostSavedSar, 0),
      notesAr: [
        `افتراض: عدد المهندسين = ${engineers} | أيام العمل/أسبوع = ${days} | نسبة التوفير = ${(rate*100).toFixed(0)}%`,
        "هذا تقدير أولي (MVP) قابل للتحسين بعد جمع بيانات أكثر."
      ],
      notesEn: [
        `Assumptions: Engineers = ${engineers} | Days/week = ${days} | Saving rate = ${(rate*100).toFixed(0)}%`,
        "This is an early MVP estimate; refine after more data."
      ]
    };
  }

  return { axisScores, axisScoresByRole, dna, painSignals, quickWins, aiOpportunities, roiEstimate };
}

function num(v: any): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function round(n: number, d: number) {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}

function emptyScores(): AxisScores {
  return {
    Process: 0, DailyOps: 0, Data: 0, Finance: 0, Governance: 0, Decision: 0, Automation: 0, AIReadiness: 0
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
