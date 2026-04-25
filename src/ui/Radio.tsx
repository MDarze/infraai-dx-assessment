// src/ui/Radio.tsx
interface Option {
  value: string;
  label: string;
}

interface Props {
  name: string;
  value?: string;
  options: Option[];
  onChange: (v: string) => void;
}

export function Radio({ name, value, options, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-3 py-2"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={active}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={`inline-block h-4 w-4 rounded-[2px] border ${
                active ? "border-brand bg-brand" : "border-border bg-surface"
              }`}
            />
            <span className="text-base text-ink">{o.label}</span>
          </label>
        );
      })}
    </div>
  );
}
