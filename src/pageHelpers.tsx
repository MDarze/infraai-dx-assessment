/**
 * Inline helper components and utilities shared by the page components.
 * These are preserved from the original App.tsx during the Phase 4 refactor.
 * They will be replaced by proper primitives in later phases.
 */
import React from "react";

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow">
      <div className="text-sm text-slate-300 mb-3">{title}</div>
      {children}
    </div>
  );
}

export function Field({ label, value, onChange, placeholder }: any) {
  return (
    <label className="text-sm">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <input
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function NumberField({ label, value, onChange, help }: any) {
  return (
    <label className="text-sm">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <input
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {help && <div className="text-xs text-slate-500 mt-1">{help}</div>}
    </label>
  );
}

export function Select({ label, value, onChange, options }: any) {
  return (
    <label className="text-sm">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <select
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function QuestionRenderer({ q, value, onChange }: { q: any; value: any; onChange: (v: any) => void }) {
  if (q.type === "single") {
    return (
      <div className="space-y-2">
        {q.options?.map((o: any) => (
          <label key={o.key} className="flex items-center gap-3 rounded-2xl border border-slate-800 p-3 hover:bg-slate-900/60 cursor-pointer">
            <input
              type="radio"
              name={q.id}
              checked={value === o.key}
              onChange={() => onChange(o.key)}
            />
            <span className="text-sm">
              {o.label}
              {o.labelEn && <span className="text-xs text-slate-400 block" dir="ltr">{o.labelEn}</span>}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "multi") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (k: string) => {
      const next = arr.includes(k) ? arr.filter((x: string) => x !== k) : [...arr, k];
      onChange(next);
    };
    return (
      <div className="space-y-2">
        {q.options?.map((o: any) => (
          <label key={o.key} className="flex items-center gap-3 rounded-2xl border border-slate-800 p-3 hover:bg-slate-900/60 cursor-pointer">
            <input
              type="checkbox"
              checked={arr.includes(o.key)}
              onChange={() => toggle(o.key)}
            />
            <span className="text-sm">
              {o.label}
              {o.labelEn && <span className="text-xs text-slate-400 block" dir="ltr">{o.labelEn}</span>}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "number") {
    return (
      <input
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400"
        type="number"
        step="0.1"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        placeholder="0"
      />
    );
  }

  return (
    <textarea
      className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 outline-none focus:border-sky-400 min-h-[120px]"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="اكتب هنا..."
    />
  );
}

export function axisLabel(axis: string) {
  const m: Record<string, string> = {
    Process: "العملية/سير العمل • Process",
    DailyOps: "التشغيل اليومي • Daily Ops",
    Data: "رحلة البيانات • Data Flow",
    Finance: "الرؤية المالية • Finance",
    Governance: "الامتثال/الحكومة • Governance",
    Decision: "اتخاذ القرار والمخاطر • Decision",
    Automation: "الأتمتة • Automation",
    AIReadiness: "جاهزية AI • AI Readiness",
  };
  return m[axis] ?? axis;
}

export function roleLabel(role: string) {
  const m: Record<string, string> = {
    Manager: "مدير",
    Engineer: "مهندس موقع",
    Finance: "محاسب/مالي",
    Operations: "تشغيل/مستندات",
  };
  return m[role] ?? role;
}

export function roleLabelEn(role: string) {
  const m: Record<string, string> = {
    Manager: "Manager",
    Engineer: "Site Engineer",
    Finance: "Finance",
    Operations: "Operations/Docs",
  };
  return m[role] ?? role;
}

export function countAnswers(answers: Record<string, any>) {
  return Object.values(answers).filter(v => v != null && v !== "" && !(Array.isArray(v) && v.length === 0)).length;
}
