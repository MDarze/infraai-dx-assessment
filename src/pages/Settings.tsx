import { Card } from "../ui/Card";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { t } from "../i18n/t";

export function Settings({ state, onROI, onBack }: any) {
  return (
    <div className="space-y-6">
      <Card title={t("settings.title")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t("settings.engineersCount")}
            type="number"
            value={state.roi.engineersCount}
            onChange={(e) => onROI({ engineersCount: Number(e.target.value) })}
          />
          <Field
            label={t("settings.workingDays")}
            type="number"
            value={state.roi.workingDaysPerWeek}
            onChange={(e) => onROI({ workingDaysPerWeek: Number(e.target.value) })}
          />
          <Field
            label={t("settings.savingRate")}
            type="number"
            value={Math.round(state.roi.timeSavingRate * 100)}
            onChange={(e) =>
              onROI({ timeSavingRate: Math.max(0, Math.min(0.9, Number(e.target.value) / 100)) })
            }
          />
          <Field
            label={t("settings.hourlyCost")}
            type="number"
            value={state.roi.avgHourCostSar ?? 0}
            onChange={(e) => {
              const v = Number(e.target.value);
              onROI({ avgHourCostSar: v <= 0 ? null : v });
            }}
            hint={t("settings.hourlyCost.help")}
          />
          <Field
            label={t("settings.dailyReportingHours")}
            type="number"
            value={state.roi.dailyReportingHours ?? 0}
            onChange={(e) =>
              onROI({ dailyReportingHours: Math.max(0, Number(e.target.value)) })
            }
            hint={t("settings.dailyReportingHours.help")}
          />
        </div>
        <div className="mt-4 text-xs text-ink-subtle">{t("settings.subtitle")}</div>
      </Card>

      <Button variant="secondary" className="w-full" onClick={onBack}>
        {t("header.back")}
      </Button>
    </div>
  );
}
