import { Card, Field, Select, roleLabel, countAnswers } from "../pageHelpers";
import { Role } from "../types";

const ROLES: { key: Role; labelAr: string; labelEn: string }[] = [
  { key: "Manager", labelAr: "مدير", labelEn: "Manager" },
  { key: "Engineer", labelAr: "مهندس موقع", labelEn: "Site Engineer" },
  { key: "Finance", labelAr: "محاسب/مالي", labelEn: "Finance" },
  { key: "Operations", labelAr: "تشغيل/مستندات", labelEn: "Operations/Docs" },
];

export function Start({
  state, onMeta, onAddRole, onRemoveRole, onSwitchRole, onStart
}: any) {
  return (
    <div className="space-y-4">
      <Card title="بيانات التقييم • Assessment Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="اسم العميل • Client" value={state.meta.clientName} onChange={(v: string) => onMeta({ clientName: v })} placeholder="شركة..." />
          <Field label="اسم المشروع • Project (optional)" value={state.meta.projectName ?? ""} onChange={(v: string) => onMeta({ projectName: v })} placeholder="مشروع..." />
          <Select
            label="حجم الشركة • Company size"
            value={state.meta.companySize}
            onChange={(v: string) => onMeta({ companySize: v })}
            options={[
              { value: "lt50", label: "أقل من 50 | <50" },
              { value: "50to200", label: "50–200" },
              { value: "gt200", label: "أكثر من 200 | 200+" },
            ]}
          />
          <Field label="اسم المقيم • Assessor" value={state.meta.assessorName} onChange={(v: string) => onMeta({ assessorName: v })} placeholder="أحمد..." />
        </div>
      </Card>

      <Card title="حزمة مقابلات (أدوار متعددة) • Multi-role bundle">
        <div className="grid grid-cols-1 gap-2">
          {state.respondents.map((r: any) => (
            <div key={r.id} className="rounded-2xl border border-slate-800 p-3 flex items-center justify-between">
              <button className="text-sm font-semibold hover:text-sky-300" onClick={() => onSwitchRole(r.id)}>
                {roleLabel(r.role)} <span className="text-xs text-slate-400">({countAnswers(r.answers)} answers)</span>
              </button>
              {state.respondents.length > 1 && (
                <button className="text-xs rounded-xl border border-slate-700 px-2 py-1 hover:bg-slate-900" onClick={() => onRemoveRole(r.id)}>
                  إزالة
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {ROLES.map(r => (
            <button
              key={r.key}
              className="rounded-2xl border border-slate-800 px-3 py-3 text-sm hover:bg-slate-900/60"
              onClick={() => onAddRole(r.key)}
            >
              + {r.labelAr}
              <div className="text-[11px] text-slate-400 mt-1">{r.labelEn}</div>
            </button>
          ))}
        </div>

        <div className="mt-3 text-xs text-slate-400">
          نصيحة: اعمل مقابلة واحدة لكل دور (مدير/مهندس/مالي/تشغيل) داخل نفس العميل، ثم استخرج تقرير واحد موحد.
        </div>
      </Card>

      <button
        className="w-full rounded-2xl bg-sky-400 text-slate-950 font-semibold py-3 hover:brightness-95 disabled:opacity-50"
        onClick={onStart}
        disabled={!state.meta.clientName || !state.meta.assessorName}
      >
        بدء الاستبيان • Start Survey
      </button>

      <div className="text-xs text-slate-500">
        MVP للـ 10 عملاء الأوائل: تشخيص + Quick Wins + فرص AI + ROI تقديري.
      </div>
    </div>
  );
}
