import { PageHeader } from "../ui/PageHeader";
import { Card } from "../ui/Card";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { t } from "../i18n/t";
import type { AssessmentState, Sector } from "../types";
import { SECTORS } from "../types";

const SIZE_OPTIONS = ["lt50", "50to200", "gt200"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = (s: string | undefined) => !s || EMAIL_RE.test(s);

const PHONE_DIGITS_RE = /\d/g;
const isPhoneValid = (s: string | undefined) => {
  if (!s) return true;
  const digits = (s.match(PHONE_DIGITS_RE) ?? []).length;
  return digits >= 8;
};

interface Props {
  state: AssessmentState;
  onMeta: (patch: Partial<AssessmentState["meta"]>) => void;
  onStart: () => void;
}

export function Start({ state, onMeta, onStart }: Props) {
  const { meta } = state;

  const emailOk = isEmailValid(meta.contactEmail);
  const phoneOk = isPhoneValid(meta.contactPhone);

  const canStart =
    !!meta.clientName &&
    !!meta.assessorName &&
    !!meta.companySize &&
    !!meta.sector &&
    emailOk &&
    phoneOk;

  return (
    <div className="space-y-10">
      <PageHeader title={t("start.title")} subtitle={t("start.subtitle")} />

      <Card title={t("start.section.company")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t("start.field.clientName")}
            value={meta.clientName}
            onChange={(e) => onMeta({ clientName: e.target.value })}
            placeholder="…"
          />
          <Field label={t("start.field.sector")}>
            <select
              value={meta.sector}
              onChange={(e) => onMeta({ sector: e.target.value as Sector })}
              className="h-10 rounded-[2px] border border-border bg-surface px-3 text-base text-ink focus:border-brand focus:outline-none"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {t(`sector.${s}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("start.field.companySize")}>
            <select
              value={meta.companySize}
              onChange={(e) =>
                onMeta({ companySize: e.target.value as AssessmentState["meta"]["companySize"] })
              }
              className="h-10 rounded-[2px] border border-border bg-surface px-3 text-base text-ink focus:border-brand focus:outline-none"
            >
              {SIZE_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {t(`start.size.${v}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("start.field.city")}
            value={meta.city ?? ""}
            onChange={(e) => onMeta({ city: e.target.value })}
            placeholder="…"
          />
          <Field
            label={t("start.field.commercialRegistration")}
            value={meta.commercialRegistration ?? ""}
            onChange={(e) => onMeta({ commercialRegistration: e.target.value })}
            placeholder="…"
            hint={t("start.field.commercialRegistration.hint")}
          />
        </div>
      </Card>

      <Card title={t("start.section.assessor")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t("start.field.assessorName")}
            value={meta.assessorName}
            onChange={(e) => onMeta({ assessorName: e.target.value })}
            placeholder="…"
          />
          <Field
            label={t("start.field.contactEmail")}
            type="email"
            value={meta.contactEmail ?? ""}
            onChange={(e) => onMeta({ contactEmail: e.target.value })}
            placeholder="…"
            error={!emailOk ? t("start.field.contactEmail.invalid") : undefined}
          />
          <Field
            label={t("start.field.contactPhone")}
            type="tel"
            value={meta.contactPhone ?? ""}
            onChange={(e) => onMeta({ contactPhone: e.target.value })}
            placeholder="+966 5X XXX XXXX"
            error={!phoneOk ? t("start.field.contactPhone.invalid") : undefined}
          />
        </div>
      </Card>

      <Button
        variant="primary"
        className="w-full"
        disabled={!canStart}
        onClick={onStart}
      >
        {t("start.begin")}
      </Button>
    </div>
  );
}
