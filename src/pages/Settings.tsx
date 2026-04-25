import { Card, NumberField } from "../pageHelpers";

export function Settings({ state, onROI, onBack }: any) {
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
