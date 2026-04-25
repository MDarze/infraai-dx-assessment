// src/ui/Card.tsx
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  meta?: string;
}

export function Card({ title, meta, className = "", children, ...rest }: Props) {
  return (
    <section
      className={`rounded-[2px] border border-border bg-surface p-6 ${className}`}
      {...rest}
    >
      {(title || meta) && (
        <header className="mb-4 flex items-baseline justify-between gap-4">
          {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
          {meta && <span className="text-xs text-ink-subtle">{meta}</span>}
        </header>
      )}
      {children}
    </section>
  );
}
