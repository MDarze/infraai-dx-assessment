// src/ui/Field.tsx
import { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  children?: ReactNode; // for custom controls (e.g., Select)
}

export function Field({ label, hint, error, children, id, className = "", ...rest }: Props) {
  const fieldId = id ?? `f-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label htmlFor={fieldId} className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs text-ink-muted">{label}</span>
      {children ?? (
        <input
          id={fieldId}
          className="h-10 rounded-[2px] border border-border bg-surface px-3 text-base text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none"
          {...rest}
        />
      )}
      {hint && <span className="text-xs text-ink-subtle">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
