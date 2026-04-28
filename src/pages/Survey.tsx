import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { QuestionRenderer, dimensionLabelLocale } from "../pageHelpers";
import { t } from "../i18n/t";
import { useLocale } from "../i18n/useLocale";
import type { AnswerValue, QuestionDef } from "../types";

interface Props {
  questions: QuestionDef[];
  answers: Record<string, AnswerValue>;
  onAnswer: (qid: string, value: AnswerValue) => void;
  onBack: () => void;
  onDone: () => void;
}

export function Survey({ questions, answers, onAnswer, onBack, onDone }: Props) {
  const [idx, setIdx] = useState(0);
  const [locale] = useLocale();
  const q = questions[idx];

  const next = () => setIdx((i) => Math.min(i + 1, questions.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const isLast = idx >= questions.length - 1;
  const advance = () => {
    if (isLast) onDone();
    else next();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        advance();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onAnswer(q.id, null);
        return;
      }
      if (q.type === "mcq" && q.options && /^[1-4]$/.test(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        const opt = q.options[optIdx];
        if (!opt) return;
        e.preventDefault();
        onAnswer(q.id, opt.key);
      }
      if (q.type === "yn_conditional") {
        if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          onAnswer(q.id, { answer: "yes" });
        } else if (e.key.toLowerCase() === "n") {
          e.preventDefault();
          onAnswer(q.id, { answer: "no" });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, q, onAnswer, isLast]);

  if (!q) {
    return (
      <Card>
        <div className="text-sm">{t("survey.empty") || "No questions for this sector."}</div>
        <Button variant="secondary" className="mt-4" onClick={onBack}>
          {t("header.back")}
        </Button>
      </Card>
    );
  }

  const questionText = locale === "en" ? q.label_en : q.label_ar;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between text-xs text-ink-subtle px-1">
        <span>{dimensionLabelLocale(q.dimension, locale)}</span>
        <span className="mono">
          {t("survey.meta.count", { n: idx + 1, total: questions.length })}
        </span>
      </div>

      <Card>
        <div className="text-lg font-medium text-ink mb-2">{questionText}</div>
        <div className="text-xs text-ink-muted mb-4 mono">{q.id}</div>

        <QuestionRenderer
          q={q}
          value={answers[q.id]}
          onChange={(v) => onAnswer(q.id, v)}
        />

        {q.type === "mcq" && q.options && (
          <div className="mt-4 text-xs text-ink-subtle">
            <span className="mono">1–{q.options.length}</span> · Enter · Esc
          </div>
        )}
        {q.type === "yn_conditional" && (
          <div className="mt-4 text-xs text-ink-subtle">
            <span className="mono">Y/N</span> · Enter · Esc
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          {t("header.back")}
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={prev}
          disabled={idx === 0}
        >
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
