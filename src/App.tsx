import React, { useMemo, useState } from "react";
import questionsData from "./questions.json";
import { analyze } from "./analysis";
import { AssessmentState, QuestionDef, Role, AnswerValue, Respondent } from "./types";
import { clearState, loadState, saveState } from "./storage";
import { hasBackend, syncToBackend } from "./api";
import { Start } from "./pages/Start";
import { Survey } from "./pages/Survey";
import { Results, exportPdf } from "./pages/Results";
import { Settings } from "./pages/Settings";
import { AppHeader } from "./ui/AppHeader";

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
          contactPhone: current.meta.contactPhone,
          commercialRegistration: current.meta.commercialRegistration,
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
      <AppHeader
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

function Footer({ step }: { step: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-3 text-xs text-ink-subtle flex justify-between">
        <span>InfraAI · Field Assessment</span>
        <span className="mono">{step}</span>
      </div>
    </div>
  );
}
