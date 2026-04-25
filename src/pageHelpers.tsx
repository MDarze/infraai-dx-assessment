/**
 * Inline helper components and utilities shared by the page components.
 * These are preserved from the original App.tsx during the Phase 4 refactor.
 * They will be replaced by proper primitives in later phases.
 */
import React from "react";
import { t } from "./i18n/t";
import { useLocale } from "./i18n/useLocale";

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
  const [locale] = useLocale();
  const optionLabel = (o: any) => (locale === "en" && o.labelEn ? o.labelEn : o.label);

  if (q.type === "single") {
    return (
      <div className="space-y-2">
        {q.options?.map((o: any) => (
          <label key={o.key} className="flex items-center gap-3 rounded-[2px] border border-border bg-surface p-3 hover:bg-surface-alt cursor-pointer">
            <input
              type="radio"
              name={q.id}
              checked={value === o.key}
              onChange={() => onChange(o.key)}
            />
            <span className="text-sm">{optionLabel(o)}</span>
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
          <label key={o.key} className="flex items-center gap-3 rounded-[2px] border border-border bg-surface p-3 hover:bg-surface-alt cursor-pointer">
            <input
              type="checkbox"
              checked={arr.includes(o.key)}
              onChange={() => toggle(o.key)}
            />
            <span className="text-sm">{optionLabel(o)}</span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "number") {
    return (
      <input
        className="w-full rounded-[2px] border border-border bg-surface text-ink p-3 outline-none focus:border-brand"
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
      className="w-full rounded-[2px] border border-border bg-surface text-ink p-3 outline-none focus:border-brand min-h-[120px]"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("survey.note.input.placeholder")}
    />
  );
}

const AXIS_KEYS = [
  "Process", "DailyOps", "Data", "Finance",
  "Governance", "Decision", "Automation", "AIReadiness",
] as const;
type AxisKey = typeof AXIS_KEYS[number];

export function axisLabel(axis: string) {
  return (AXIS_KEYS as readonly string[]).includes(axis)
    ? t(`axis.${axis as AxisKey}` as any)
    : axis;
}

const ROLE_KEYS = ["Manager", "Engineer", "Finance", "Operations"] as const;
type RoleKey = typeof ROLE_KEYS[number];

export function roleLabel(role: string) {
  return (ROLE_KEYS as readonly string[]).includes(role)
    ? t(`start.role.${role as RoleKey}` as any)
    : role;
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
