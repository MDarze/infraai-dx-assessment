// src/ui/Segmented.tsx
interface Option {
  value: string;
  label: string;
}

interface Props {
  value?: string;
  options: Option[];
  onChange: (v: string) => void;
  ariaLabel?: string;
}

export function Segmented({ value, options, onChange, ariaLabel }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-[2px] border border-border bg-surface p-0.5"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`min-w-[44px] rounded-[2px] px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-brand text-brand-ink"
                : "bg-transparent text-ink hover:bg-surface-alt"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
