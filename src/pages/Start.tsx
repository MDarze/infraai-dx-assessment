import { PageHeader } from "../ui/PageHeader";
import { Card } from "../ui/Card";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { t } from "../i18n/t";
import type { AssessmentState, Role } from "../types";

const ALL_ROLES: Role[] = ["Manager", "Engineer", "Finance", "Operations"];

const SIZE_OPTIONS = ["lt50", "50to200", "gt200"] as const;

interface Props {
  state: AssessmentState;
  onMeta: (patch: Partial<AssessmentState["meta"]>) => void;
  onAddRole: (role: Role) => void;
  onRemoveRole: (id: string) => void;
  onSwitchRole: (id: string) => void;
  onStart: () => void;
}

export function Start({ state, onMeta, onAddRole, onRemoveRole, onStart }: Props) {
  const { meta, respondents } = state;

  const usedRoles = respondents.map((r) => r.role);
  const availableRoles = ALL_ROLES.filter((r) => !usedRoles.includes(r));

  const canStart =
    !!meta.clientName &&
    !!meta.assessorName &&
    !!meta.companySize &&
    respondents.length > 0;

  return (
    <div className="space-y-10">
      <PageHeader title={t("start.title")} subtitle={t("start.subtitle")} />

      {/* Company Card */}
      <Card title={t("start.section.company")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t("start.field.clientName")}
            value={meta.clientName}
            onChange={(e) => onMeta({ clientName: e.target.value })}
            placeholder="…"
          />
          <Field label={t("start.field.companySize")}>
            <select
              value={meta.companySize}
              onChange={(e) => onMeta({ companySize: e.target.value as AssessmentState["meta"]["companySize"] })}
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
        </div>
      </Card>

      {/* Assessor Card */}
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
          />
        </div>
      </Card>

      {/* Respondents Card */}
      <Card title={t("start.section.respondents")}>
        {/* Current respondent pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {respondents.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 rounded-[2px] border border-border bg-surface-alt px-3 py-1.5"
            >
              <span className="text-sm font-medium text-ink">
                {t(`start.role.${r.role}`)}
              </span>
              {respondents.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-1 py-0 text-xs text-ink-subtle"
                  onClick={() => onRemoveRole(r.id)}
                >
                  {t("start.respondent.remove")}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add role area */}
        {availableRoles.length > 0 && (
          <AddRoleArea availableRoles={availableRoles} onAddRole={onAddRole} />
        )}
      </Card>

      {/* Primary CTA */}
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

function AddRoleArea({
  availableRoles,
  onAddRole,
}: {
  availableRoles: Role[];
  onAddRole: (role: Role) => void;
}) {
  if (availableRoles.length === 1) {
    return (
      <Button variant="secondary" size="sm" onClick={() => onAddRole(availableRoles[0])}>
        + {t("start.respondent.add")} — {t(`start.role.${availableRoles[0]}`)}
      </Button>
    );
  }

  return (
    <Field label={t("start.respondent.add")}>
      <div className="flex gap-2">
        <select
          id="add-role-select"
          className="h-10 flex-1 rounded-[2px] border border-border bg-surface px-3 text-base text-ink focus:border-brand focus:outline-none"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onAddRole(e.target.value as Role);
              e.target.value = "";
            }
          }}
        >
          <option value="" disabled>
            —
          </option>
          {availableRoles.map((r) => (
            <option key={r} value={r}>
              {t(`start.role.${r}`)}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}
