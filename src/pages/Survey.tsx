import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { QuestionRenderer, axisLabel, roleLabel } from "../pageHelpers";
import { t } from "../i18n/t";
import { useLocale } from "../i18n/useLocale";

export function Survey({
  questions, answers, respondent, respondents, onSwitchRespondent, onAnswer, onBack, onDone,
}: any) {
  const [idx, setIdx] = useState(0);
  const [locale] = useLocale();
  const q = questions[idx];

  const next = () => setIdx((i: number) => Math.min(i + 1, questions.length - 1));
  const prev = () => setIdx((i: number) => Math.max(i - 1, 0));

  const isLast = idx >= questions.length - 1;
  const advance = () => {
    if (isLast) onDone();
    else next();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        advance();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (q.type === "multi") onAnswer(q.id, []);
        else if (q.type === "number" || q.type === "text") onAnswer(q.id, null);
        else onAnswer(q.id, null);
        return;
      }
      if (/^[1-9]$/.test(e.key) && (q.type === "single" || q.type === "multi") && q.options) {
        const optIdx = parseInt(e.key, 10) - 1;
        const opt = q.options[optIdx];
        if (!opt) return;
        e.preventDefault();
        if (q.type === "single") {
          onAnswer(q.id, opt.key);
        } else {
          const cur = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
          const set = new Set(cur);
          if (set.has(opt.key)) set.delete(opt.key);
          else set.add(opt.key);
          onAnswer(q.id, Array.from(set));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, q, answers, isLast, onAnswer, onDone]);

  const questionText = locale === "en" && q.textEn ? q.textEn : q.text;
  const helpText = locale === "en" && q.helpEn ? q.helpEn : q.help;

  return (
    <div className="space-y-6">
      <Card title={t("survey.role.section")}>
        <div className="flex flex-wrap gap-2">
          {respondents.map((r: any) => {
            const active = r.id === respondent.id;
            return (
              <button
                key={r.id}
                onClick={() => onSwitchRespondent(r.id)}
                className={`rounded-[2px] border px-3 py-2 text-sm transition-colors ${
                  active
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-surface text-ink hover:bg-surface-alt"
                }`}
              >
                {roleLabel(r.role)}
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-ink-subtle">{t("survey.role.helper")}</div>
      </Card>

      <div className="flex items-baseline justify-between text-xs text-ink-subtle px-1">
        <span>{axisLabel(q.axis)}</span>
        <span className="mono">
          {t("survey.meta.count", { n: idx + 1, total: questions.length })}
        </span>
      </div>

      <Card>
        <div className="text-lg font-medium text-ink mb-2">{questionText}</div>

        {helpText && (
          <div className="text-xs text-ink-muted mb-4">{helpText}</div>
        )}

        <QuestionRenderer q={q} value={answers[q.id]} onChange={(v: any) => onAnswer(q.id, v)} />

        {(q.type === "single" || q.type === "multi") && q.options && q.options.length <= 9 && (
          <div className="mt-4 text-xs text-ink-subtle">
            <span className="mono">1–{q.options.length}</span> · Enter · Esc
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          {t("header.back")}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={prev} disabled={idx === 0}>
          {t("survey.previous")}
        </Button>
        {!isLast ? (
          <Button variant="primary" className="flex-1" onClick={next}>
            {t("survey.next")}
          </Button>
        ) : (
          <Button variant="primary" className="flex-1" onClick={onDone}>
            {t("survey.analyze")}
          </Button>
        )}
      </div>
    </div>
  );
}
