/**
 * Shared helpers: question renderer + label translators.
 */
import { t } from "./i18n/t";
import { useLocale } from "./i18n/useLocale";
import type { Dimension, FollowUpDef, OptionDef, QuestionDef, Sector } from "./types";
import { getDimensionMeta } from "./questionBank";

type YnAnswer = { answer: "yes" | "no"; followUp?: string | null };

export function QuestionRenderer({
  q,
  value,
  onChange,
}: {
  q: QuestionDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const [locale] = useLocale();
  const optionLabel = (o: OptionDef) => (locale === "en" ? o.en : o.ar);

  if (q.type === "mcq") {
    return (
      <div className="space-y-2">
        {q.options?.map((o) => (
          <label
            key={o.key}
            className="flex items-center gap-3 rounded-[2px] border border-border bg-surface p-3 hover:bg-surface-alt cursor-pointer"
          >
            <input
              type="radio"
              name={q.id}
              checked={value === o.key}
              onChange={() => onChange(o.key)}
            />
            <span className="text-sm">
              <span className="mono text-ink-subtle me-2">{o.key}.</span>
              {optionLabel(o)}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "yn_conditional") {
    const v: YnAnswer | null =
      value && typeof value === "object" && "answer" in value ? value : null;
    const setAnswer = (ans: "yes" | "no") => {
      if (v?.answer === ans) return;
      onChange({ answer: ans, followUp: null });
    };
    const setFollowUp = (k: string) => {
      onChange({ answer: v?.answer ?? "yes", followUp: k });
    };
    const showFollowUp = q.follow_up && v && q.conditional_if && v.answer === q.conditional_if;
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          {(["yes", "no"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setAnswer(opt)}
              className={`flex-1 rounded-[2px] border px-4 py-3 text-sm transition-colors ${
                v?.answer === opt
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-surface text-ink hover:bg-surface-alt"
              }`}
            >
              {t(`survey.yn.${opt}`)}
            </button>
          ))}
        </div>
        {showFollowUp && (
          <div className="space-y-2 ps-3 border-s-2 border-brand/40">
            <div className="text-sm font-medium">
              {locale === "en" ? q.follow_up!.label_en : q.follow_up!.label_ar}
            </div>
            <FollowUpRenderer
              followUp={q.follow_up!}
              value={v?.followUp ?? null}
              onChange={setFollowUp}
              locale={locale}
            />
          </div>
        )}
      </div>
    );
  }

  // open
  return (
    <textarea
      className="w-full rounded-[2px] border border-border bg-surface text-ink p-3 outline-none focus:border-brand min-h-[120px]"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("survey.note.input.placeholder")}
    />
  );
}

function FollowUpRenderer({
  followUp,
  value,
  onChange,
  locale,
}: {
  followUp: FollowUpDef;
  value: string | null;
  onChange: (k: string) => void;
  locale: string;
}) {
  return (
    <div className="space-y-2">
      {followUp.options.map((o) => (
        <label
          key={o.key}
          className="flex items-center gap-3 rounded-[2px] border border-border bg-surface p-3 hover:bg-surface-alt cursor-pointer"
        >
          <input
            type="radio"
            name={followUp.id}
            checked={value === o.key}
            onChange={() => onChange(o.key)}
          />
          <span className="text-sm">
            <span className="mono text-ink-subtle me-2">{o.key}.</span>
            {locale === "en" ? o.en : o.ar}
          </span>
        </label>
      ))}
    </div>
  );
}

export function dimensionLabel(dim: Dimension): string {
  const meta = getDimensionMeta(dim);
  return t(`dimension.${dim}` as any) || meta.label_en;
}

export function dimensionLabelLocale(dim: Dimension, locale: string): string {
  const meta = getDimensionMeta(dim);
  return locale === "en" ? meta.label_en : meta.label_ar;
}

export function sectorLabel(sector: Sector): string {
  return t(`sector.${sector}` as any);
}

export function countAnswers(answers: Record<string, any>) {
  return Object.values(answers).filter((v) => {
    if (v == null) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (typeof v === "object" && "answer" in v) return v.answer === "yes" || v.answer === "no";
    return true;
  }).length;
}
