import { useState } from "react";
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

      <Card
        title={axisLabel(q.axis)}
        meta={t("survey.meta.count", { n: idx + 1, total: questions.length })}
      >
        <div className="text-lg font-medium text-ink mb-2">{questionText}</div>

        {helpText && (
          <div className="text-xs text-ink-muted mb-4">{helpText}</div>
        )}

        <QuestionRenderer q={q} value={answers[q.id]} onChange={(v: any) => onAnswer(q.id, v)} />
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          {t("header.back")}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={prev} disabled={idx === 0}>
          {t("survey.previous")}
        </Button>
        {idx < questions.length - 1 ? (
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
