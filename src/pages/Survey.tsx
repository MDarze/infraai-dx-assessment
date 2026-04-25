import { useState } from "react";
import { Card, QuestionRenderer, axisLabel, roleLabel } from "../pageHelpers";

export function Survey({
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
