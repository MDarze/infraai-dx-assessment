import React, { useMemo, useState } from "react";
import questionsData from "./questions.json";
import { analyze } from "./analysis";
import { AssessmentState, QuestionDef, Role, AnswerValue, Respondent } from "./types";
import { clearState, loadState, saveState } from "./storage";
import { hasBackend, syncToBackend } from "./api";

const ROLES: { key: Role; labelAr: string; labelEn: string }[] = [
  { key: "Manager", labelAr: "مدير", labelEn: "Manager" },
  { key: "Engineer", labelAr: "مهندس موقع", labelEn: "Site Engineer" },
  { key: "Finance", labelAr: "محاسب/مالي", labelEn: "Finance" },
  { key: "Operations", labelAr: "تشغيل/مستندات", labelEn: "Operations/Docs" },
];

type Step = "start" | "survey" | "result" | "settings";

export default function App() {
  const questions = questionsData as unknown as QuestionDef[];
  const persisted = loadState();

  const [step, setStep] = useState<Step>(persisted ? "survey" : "start");
  const [state, setState] = useState<AssessmentState>(
    persisted ?? defaultState()
  );

  const activeRespondent = useMemo(() => state.respondents.find(r => r.id === state.activeRespondentId)!, [state]);

  const visibleQuestions = useMemo(() => {
    const role = activeRespondent.role;
    return questions.filter(q => q.role === "All" || q.role === role);
  }, [questions, activeRespondent.role]);

  const result = useMemo(() => {
    if (step !== "result") return null;
    return analyze(questions, state);
  }, [questions, state, step]);

  const persist = (next: AssessmentState) => {
    setState(next);
    saveState(next);
  };

  const updateMeta = (patch: Partial<AssessmentState["meta"]>) => {
    persist({ ...state, meta: { ...state.meta, ...patch } });
  };

  const setAnswer = (qid: string, value: AnswerValue) => {
    const nextRespondents = state.respondents.map(r =>
      r.id === state.activeRespondentId
        ? { ...r, answers: { ...r.answers, [qid]: value } }
        : r
    );
    persist({ ...state, respondents: nextRespondents });
  };

  const switchRespondent = (id: string) => {
    persist({ ...state, activeRespondentId: id });
  };

  const addRespondent = (role: Role) => {
    if (state.respondents.some(r => r.role === role)) return;
    const r: Respondent = { id: crypto.randomUUID(), role, answers: {} };
    const next = { ...state, respondents: [...state.respondents, r], activeRespondentId: r.id };
    persist(next);
  };

  const removeRespondent = (id: string) => {
    const nextRespondents = state.respondents.filter(r => r.id !== id);
    const active = nextRespondents[0]?.id ?? "";
    persist({ ...state, respondents: nextRespondents, activeRespondentId: active });
  };

  const updateROI = (patch: Partial<AssessmentState["roi"]>) => {
    persist({ ...state, roi: { ...state.roi, ...patch } });
  };

  const reset = () => {
    clearState();
    setState(defaultState());
    setStep("start");
  };

  const syncNow = async (current: AssessmentState, { force = false }: { force?: boolean } = {}) => {
    if (!hasBackend()) return;
    if (!force && current.sync?.status === "ok" && current.sync.assessmentId) return;
    const pending: AssessmentState = { ...current, sync: { status: "pending" } };
    persist(pending);
    try {
      const assessmentId = await syncToBackend({
        meta: {
          clientName: current.meta.clientName,
          companySize: current.meta.companySize,
          assessorName: current.meta.assessorName,
          contactEmail: current.meta.contactEmail,
          city: current.meta.city,
        },
        respondents: current.respondents.map(r => ({ role: r.role, answers: r.answers as Record<string, unknown> })),
        roi: {
          engineersCount: current.roi.engineersCount,
          workingDaysPerWeek: current.roi.workingDaysPerWeek,
          timeSavingRate: current.roi.timeSavingRate,
          avgHourCostSar: current.roi.avgHourCostSar,
        },
      });
      persist({ ...pending, sync: { status: "ok", assessmentId, syncedAt: new Date().toISOString() } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      persist({ ...pending, sync: { status: "error", error: msg } });
    }
  };

  const finishSurvey = () => {
    setStep("result");
    void syncNow(state);
  };

  return (
    <div className="min-h-screen">
      <Header
        onReset={reset}
        onSettings={() => setStep("settings")}
        canGoBack={step !== "start"}
        onBack={() => setStep(step === "settings" ? "start" : "start")}
      />

      <div className="mx-auto max-w-3xl p-4 pb-24">
        {step === "start" && (
          <Start
            state={state}
            onMeta={updateMeta}
            onAddRole={addRespondent}
            onRemoveRole={removeRespondent}
            onSwitchRole={switchRespondent}
            onStart={() => setStep("survey")}
          />
        )}

        {step === "settings" && (
          <Settings state={state} onROI={updateROI} onBack={() => setStep("start")} />
        )}

        {step === "survey" && (
          <Survey
            questions={visibleQuestions}
            answers={activeRespondent.answers}
            respondent={activeRespondent}
            respondents={state.respondents}
            onSwitchRespondent={switchRespondent}
            onAnswer={setAnswer}
            onBack={() => setStep("start")}
            onDone={finishSurvey}
          />
        )}

        {step === "result" && result && (
          <Results
            state={state}
            result={result}
            onBack={() => setStep("survey")}
            onExportPdf={() => exportPdf(state, result)}
            onRetrySync={() => syncNow(state, { force: true })}
          />
        )}
      </div>

      <Footer step={step} />
    </div>
  );
}

function defaultState(): AssessmentState {
  const initial: Respondent = { id: crypto.randomUUID(), role: "Engineer", answers: {} };
  return {
    meta: {
      clientName: "",
      projectName: "",
      companySize: "50to200",
      assessorName: "",
      createdAt: new Date().toISOString(),
    },
    respondents: [initial],
    activeRespondentId: initial.id,
    roi: {
      engineersCount: 3,
      workingDaysPerWeek: 5,
      timeSavingRate: 0.25,
      avgHourCostSar: null
    }
  };
}

function Header({
  onReset, onSettings
}: { onReset: () => void; onSettings: () => void; canGoBack: boolean; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center">
            <span className="text-sky-300 font-bold">IA</span>
          </div>
          <div>
            <div className="font-semibold">InfraAI Field Assessment</div>
            <div className="text-xs text-slate-400">Bundle (Multi-role) • PWA • Offline cache</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="text-xs rounded-xl border border-slate-700 px-3 py-2 hover:bg-slate-900"
            onClick={onSettings}
          >
            ROI Settings
          </button>
          <button
            className="text-xs rounded-xl border border-slate-700 px-3 py-2 hover:bg-slate-900"
            onClick={onReset}
          >
            New
          </button>
        </div>
      </div>
    </div>
  );
}

function Start({
  state, onMeta, onAddRole, onRemoveRole, onSwitchRole, onStart
}: any) {
  return (
    <div className="space-y-4">
      <Card title="بيانات التقييم • Assessment Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="اسم العميل • Client" value={state.meta.clientName} onChange={(v: string) => onMeta({ clientName: v })} placeholder="شركة..." />
          <Field label="اسم المشروع • Project (optional)" value={state.meta.projectName ?? ""} onChange={(v: string) => onMeta({ projectName: v })} placeholder="مشروع..." />
          <Select
            label="حجم الشركة • Company size"
            value={state.meta.companySize}
            onChange={(v: string) => onMeta({ companySize: v })}
            options={[
              { value: "lt50", label: "أقل من 50 | <50" },
              { value: "50to200", label: "50–200" },
              { value: "gt200", label: "أكثر من 200 | 200+" },
            ]}
          />
          <Field label="اسم المقيم • Assessor" value={state.meta.assessorName} onChange={(v: string) => onMeta({ assessorName: v })} placeholder="أحمد..." />
        </div>
      </Card>

      <Card title="حزمة مقابلات (أدوار متعددة) • Multi-role bundle">
        <div className="grid grid-cols-1 gap-2">
          {state.respondents.map((r: any) => (
            <div key={r.id} className="rounded-2xl border border-slate-800 p-3 flex items-center justify-between">
              <button className="text-sm font-semibold hover:text-sky-300" onClick={() => onSwitchRole(r.id)}>
                {roleLabel(r.role)} <span className="text-xs text-slate-400">({countAnswers(r.answers)} answers)</span>
              </button>
              {state.respondents.length > 1 && (
                <button className="text-xs rounded-xl border border-slate-700 px-2 py-1 hover:bg-slate-900" onClick={() => onRemoveRole(r.id)}>
                  إزالة
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {ROLES.map(r => (
            <button
              key={r.key}
              className="rounded-2xl border border-slate-800 px-3 py-3 text-sm hover:bg-slate-900/60"
              onClick={() => onAddRole(r.key)}
            >
              + {r.labelAr}
              <div className="text-[11px] text-slate-400 mt-1">{r.labelEn}</div>
            </button>
          ))}
        </div>

        <div className="mt-3 text-xs text-slate-400">
          نصيحة: اعمل مقابلة واحدة لكل دور (مدير/مهندس/مالي/تشغيل) داخل نفس العميل، ثم استخرج تقرير واحد موحد.
        </div>
      </Card>

      <button
        className="w-full rounded-2xl bg-sky-400 text-slate-950 font-semibold py-3 hover:brightness-95 disabled:opacity-50"
        onClick={onStart}
        disabled={!state.meta.clientName || !state.meta.assessorName}
      >
        بدء الاستبيان • Start Survey
      </button>

      <div className="text-xs text-slate-500">
        MVP للـ 10 عملاء الأوائل: تشخيص + Quick Wins + فرص AI + ROI تقديري.
      </div>
    </div>
  );
}

function Settings({ state, onROI, onBack }: any) {
  return (
    <div className="space-y-4">
      <Card title="إعدادات ROI (للتحليل) • ROI Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <NumberField
            label="عدد المهندسين (للحساب) • Engineers count"
            value={state.roi.engineersCount}
            onChange={(v: number) => onROI({ engineersCount: v })}
          />
          <NumberField
            label="أيام العمل/أسبوع • Working days/week"
            value={state.roi.workingDaysPerWeek}
            onChange={(v: number) => onROI({ workingDaysPerWeek: v })}
          />
          <NumberField
            label="نسبة التوفير المتوقعة (0–90%) • Saving rate"
            value={Math.round(state.roi.timeSavingRate * 100)}
            onChange={(v: number) => onROI({ timeSavingRate: Math.max(0, Math.min(0.9, v / 100)) })}
          />
          <NumberField
            label="تكلفة ساعة ثابتة (اختياري) • Fixed hourly cost (optional)"
            value={state.roi.avgHourCostSar ?? 0}
            onChange={(v: number) => onROI({ avgHourCostSar: v <= 0 ? null : v })}
            help="لو 0 سيتم أخذها من إجابة المحاسب (إن وجدت)."
          />
        </div>
        <div className="mt-3 text-xs text-slate-400">
          هذه الإعدادات تؤثر على ROI التقديري فقط، ولا تغيّر الدرجات.
        </div>
      </Card>

      <button className="w-full rounded-2xl border border-slate-800 py-3 hover:bg-slate-900" onClick={onBack}>
        رجوع • Back
      </button>
    </div>
  );
}

function Survey({
  questions, answers, respondent, respondents, onSwitchRespondent, onAnswer, onBack, onDone,
}: any) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];

  const next = () => setIdx((i: number) => Math.min(i + 1, questions.length - 1));
  const prev = () => setIdx((i: number) => Math.max(i - 1, 0));

  return (
    <div className="space-y-4">
      <Card title="الدور الحالي • Current role">
        <div className="flex flex-wrap gap-2">
          {respondents.map((r: any) => (
            <button
              key={r.id}
              onClick={() => onSwitchRespondent(r.id)}
              className={`rounded-2xl border px-3 py-2 text-sm ${
                r.id === respondent.id ? "border-sky-400 bg-slate-900" : "border-slate-800 hover:bg-slate-900/60"
              }`}
            >
              {roleLabel(r.role)}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-400">يمكنك التبديل بين الأدوار لإكمال نفس تقييم العميل.</div>
      </Card>

      <Card title={`سؤال ${idx + 1} / ${questions.length}`}>
        <div className="text-sm text-slate-400 mb-2">{axisLabel(q.axis)}</div>

        <div className="text-lg font-semibold mb-1">{q.text}</div>
        {q.textEn && <div className="text-sm text-slate-300 mb-1" dir="ltr">{q.textEn}</div>}

        {(q.help || q.helpEn) && (
          <div className="text-xs text-slate-400 mb-3">
            {q.help}
            {q.helpEn && <div dir="ltr">{q.helpEn}</div>}
          </div>
        )}

        <QuestionRenderer q={q} value={answers[q.id]} onChange={(v: any) => onAnswer(q.id, v)} />
      </Card>

      <div className="flex gap-2">
        <button className="flex-1 rounded-2xl border border-slate-800 py-3 hover:bg-slate-900" onClick={onBack}>
          رجوع • Back
        </button>
        <button className="flex-1 rounded-2xl border border-slate-800 py-3 hover:bg-slate-900" onClick={prev} disabled={idx === 0}>
          السابق • Prev
        </button>
        {idx < questions.length - 1 ? (
          <button className="flex-1 rounded-2xl bg-sky-400 text-slate-950 font-semibold py-3 hover:brightness-95" onClick={next}>
            التالي • Next
          </button>
        ) : (
          <button className="flex-1 rounded-2xl bg-emerald-400 text-slate-950 font-semibold py-3 hover:brightness-95" onClick={onDone}>
            تحليل النتائج • Analyze
          </button>
        )}
      </div>
    </div>
  );
}

function Results({ state, result, onBack, onExportPdf, onRetrySync }: any) {
  const sync = state.sync;
  return (
    <div className="space-y-4">
      {hasBackend() && (
        <Card title="حفظ في قاعدة البيانات • Database sync">
          {sync?.status === "pending" && (
            <div className="text-sm text-slate-300">... جاري الحفظ • Saving</div>
          )}
          {sync?.status === "ok" && (
            <div className="text-sm text-emerald-300">
              تم الحفظ • Saved <span className="text-xs text-slate-400" dir="ltr">(id: {sync.assessmentId})</span>
            </div>
          )}
          {sync?.status === "error" && (
            <div className="space-y-2">
              <div className="text-sm text-rose-300" dir="ltr">Save failed: {sync.error}</div>
              <button
                className="text-xs rounded-xl border border-slate-700 px-3 py-2 hover:bg-slate-900"
                onClick={onRetrySync}
              >
                إعادة المحاولة • Retry
              </button>
            </div>
          )}
          {!sync && (
            <button
              className="text-xs rounded-xl border border-slate-700 px-3 py-2 hover:bg-slate-900"
              onClick={onRetrySync}
            >
              حفظ الآن • Sync now
            </button>
          )}
        </Card>
      )}

      <Card title="ملخص العميل • Client Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-400">العميل:</span> {state.meta.clientName}</div>
          <div><span className="text-slate-400">المقيم:</span> {state.meta.assessorName}</div>
          <div><span className="text-slate-400">التاريخ:</span> {new Date(state.meta.createdAt).toLocaleString("ar-SA")}</div>
          <div><span className="text-slate-400">الأدوار:</span> {state.respondents.map((r: any) => roleLabel(r.role)).join("، ")}</div>
        </div>
      </Card>

      <Card title="Operating DNA (Bilingual)">
        <ul className="space-y-2 text-sm">
          {Object.entries(result.dna).map(([k,v]: any) => (
            <li key={k} className="rounded-xl border border-slate-800 p-3">
              <div className="text-xs text-slate-400">{k}</div>
              <div className="font-semibold">{v}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="درجات المحاور • Axis scores (1–5)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(result.axisScores).map(([k,v]: any) => (
            <div key={k} className="rounded-2xl border border-slate-800 p-3">
              <div className="text-xs text-slate-400">{axisLabel(k)}</div>
              <div className="text-2xl font-semibold">{Number(v).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Breakdown by role موجود داخل PDF.
        </div>
      </Card>

      <Card title="إشارات ألم رقمية • Numeric pain signals">
        {result.painSignals.length ? (
          <ul className="space-y-2 text-sm">
            {result.painSignals.map((p: any) => (
              <li key={p.key} className="rounded-xl border border-slate-800 p-3">
                <div className="text-slate-200">{p.labelAr}</div>
                <div className="text-slate-400 text-xs" dir="ltr">{p.labelEn}</div>
                <div className="font-semibold mt-1">{p.value}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-slate-400">أدخل (ساعات يومية + تكلفة الساعة) لتحصل على ROI تقديري.</div>
        )}
      </Card>

      <Card title="Top Quick Wins (60 يوم)">
        <div className="space-y-2">
          {result.quickWins.map((w: any, i: number) => (
            <div key={i} className="rounded-2xl border border-slate-800 p-3">
              <div className="font-semibold">{w.titleAr}</div>
              <div className="text-xs text-slate-400 mt-1">{w.whyAr}</div>
              <div className="text-xs text-sky-300 mt-2">Impact: {w.impactAr}</div>
              <div className="mt-2 border-t border-slate-800 pt-2" dir="ltr">
                <div className="font-semibold">{w.titleEn}</div>
                <div className="text-xs text-slate-400 mt-1">{w.whyEn}</div>
                <div className="text-xs text-sky-300 mt-2">Impact: {w.impactEn}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="AI Opportunities">
        <div className="space-y-2">
          {result.aiOpportunities.map((a: any, i: number) => (
            <div key={i} className="rounded-2xl border border-slate-800 p-3">
              <div className="font-semibold">{a.titleAr}</div>
              <div className="text-xs text-slate-400 mt-1">{a.whyAr}</div>
              <div className="text-xs text-emerald-300 mt-2">Impact: {a.impactAr}</div>
              <div className="mt-2 border-t border-slate-800 pt-2" dir="ltr">
                <div className="font-semibold">{a.titleEn}</div>
                <div className="text-xs text-slate-400 mt-1">{a.whyEn}</div>
                <div className="text-xs text-emerald-300 mt-2">Impact: {a.impactEn}</div>
              </div>
            </div>
          ))}
          {!result.aiOpportunities.length && (
            <div className="text-sm text-slate-400">فرص AI غير مفعّلة (الجاهزية/البيانات قد تكون غير كافية).</div>
          )}
        </div>
      </Card>

      <Card title="ROI تقديري • ROI estimate">
        {result.roiEstimate ? (
          <div className="text-sm space-y-2">
            <div className="rounded-xl border border-slate-800 p-3">
              <div className="text-slate-400 text-xs">توفير أسبوعي تقديري • Estimated weekly saving</div>
              <div className="text-2xl font-semibold">{result.roiEstimate.weeklyCostSavedSar} SAR/week</div>
              <div className="text-xs text-slate-400 mt-1">({result.roiEstimate.weeklyHoursSaved} hours/week)</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
              <ul className="list-disc pr-5 space-y-1">
                {result.roiEstimate.notesAr.map((n: string, i: number) => <li key={i}>{n}</li>)}
              </ul>
              <ul className="list-disc pl-5 space-y-1" dir="ltr">
                {result.roiEstimate.notesEn.map((n: string, i: number) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400">أدخل القيم الرقمية لتحصل على ROI تقديري.</div>
        )}
      </Card>

      <div className="flex gap-2">
        <button className="flex-1 rounded-2xl border border-slate-800 py-3 hover:bg-slate-900" onClick={onBack}>
          رجوع • Back
        </button>
        <button
          className="flex-1 rounded-2xl border border-slate-800 py-3 hover:bg-slate-900"
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
          Export JSON
        </button>
        <button
          className="flex-1 rounded-2xl bg-amber-300 text-slate-950 font-semibold py-3 hover:brightness-95"
          onClick={onExportPdf}
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}

function exportPdf(state: any, result: any) {
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
  const axisRows = Object.entries(result.axisScores).map(([k,v]: any) => `
    <tr><td>${axisLabel(k)}</td><td style="text-align:center">${Number(v).toFixed(2)}</td></tr>
  `).join("");

  const byRole = Object.entries(result.axisScoresByRole).map(([role, scores]: any) => {
    const rows = Object.entries(scores).map(([k,v]: any) => `
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

  const dna = Object.entries(result.dna).map(([k,v]: any) => `<li><b>${k}:</b> ${v}</li>`).join("");

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

function QuestionRenderer({ q, value, onChange }: { q: any; value: any; onChange: (v: any) => void }) {
  if (q.type === "single") {
    return (
      <div className="space-y-2">
        {q.options?.map((o: any) => (
          <label key={o.key} className="flex items-center gap-3 rounded-2xl border border-slate-800 p-3 hover:bg-slate-900/60 cursor-pointer">
            <input
              type="radio"
              name={q.id}
              checked={value === o.key}
              onChange={() => onChange(o.key)}
            />
            <span className="text-sm">
              {o.label}
              {o.labelEn && <span className="text-xs text-slate-400 block" dir="ltr">{o.labelEn}</span>}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "multi") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (k: string) => {
      const next = arr.includes(k) ? arr.filter((x: string) => x !== k) : [...arr, k];
      onChange(next);
    };
    return (
      <div className="space-y-2">
        {q.options?.map((o: any) => (
          <label key={o.key} className="flex items-center gap-3 rounded-2xl border border-slate-800 p-3 hover:bg-slate-900/60 cursor-pointer">
            <input
              type="checkbox"
              checked={arr.includes(o.key)}
              onChange={() => toggle(o.key)}
            />
            <span className="text-sm">
              {o.label}
              {o.labelEn && <span className="text-xs text-slate-400 block" dir="ltr">{o.labelEn}</span>}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "number") {
    return (
      <input
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        type="number"
        step="0.1"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        placeholder="0"
      />
    );
  }

  return (
    <textarea
      className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400 min-h-[120px]"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="اكتب هنا..."
    />
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow">
      <div className="text-sm text-slate-300 mb-3">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: any) {
  return (
    <label className="text-sm">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <input
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function NumberField({ label, value, onChange, help }: any) {
  return (
    <label className="text-sm">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <input
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {help && <div className="text-xs text-slate-500 mt-1">{help}</div>}
    </label>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <label className="text-sm">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <select
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Footer({ step }: { step: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-3 text-xs text-slate-400 flex justify-between">
        <span>InfraAI • Field Assessment MVP (Bundle)</span>
        <span>Step: {step}</span>
      </div>
    </div>
  );
}

function axisLabel(axis: string) {
  const m: Record<string,string> = {
    Process: "العملية/سير العمل • Process",
    DailyOps: "التشغيل اليومي • Daily Ops",
    Data: "رحلة البيانات • Data Flow",
    Finance: "الرؤية المالية • Finance",
    Governance: "الامتثال/الحكومة • Governance",
    Decision: "اتخاذ القرار والمخاطر • Decision",
    Automation: "الأتمتة • Automation",
    AIReadiness: "جاهزية AI • AI Readiness",
  };
  return m[axis] ?? axis;
}

function roleLabel(role: string) {
  const m: Record<string,string> = {
    Manager: "مدير",
    Engineer: "مهندس موقع",
    Finance: "محاسب/مالي",
    Operations: "تشغيل/مستندات",
  };
  return m[role] ?? role;
}

function roleLabelEn(role: string) {
  const m: Record<string,string> = {
    Manager: "Manager",
    Engineer: "Site Engineer",
    Finance: "Finance",
    Operations: "Operations/Docs",
  };
  return m[role] ?? role;
}

function countAnswers(answers: Record<string, any>) {
  return Object.values(answers).filter(v => v != null && v !== "" && !(Array.isArray(v) && v.length === 0)).length;
}
