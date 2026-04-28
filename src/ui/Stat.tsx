// src/ui/Stat.tsx
interface Props {
  value: string;
  label: string;
  hint?: string;
  emphasis?: boolean;
}

export function Stat({ value, label, hint, emphasis = false }: Props) {
  return (
    <div className="rounded-[2px] border border-border bg-surface p-4">
      <div
        className={`mono text-ink ${emphasis ? "text-3xl font-semibold" : "text-xl font-semibold"}`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
      {hint && <div className="mt-1 text-[10px] text-ink-subtle mono">{hint}</div>}
    </div>
  );
}
