// src/ui/PageHeader.tsx
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
}

export function PageHeader({ title, subtitle, meta }: Props) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}
      {meta && <div className="mt-4 border-t border-border pt-4">{meta}</div>}
    </header>
  );
}
