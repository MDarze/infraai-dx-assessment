// src/ui/ThemeToggle.tsx
import { useState, useEffect } from "react";
import { getTheme, cycleTheme, type Theme } from "../theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getTheme());
  useEffect(() => {}, [theme]);
  const icon = theme === "dark" ? "●" : theme === "light" ? "○" : "◐";
  return (
    <button
      type="button"
      onClick={() => setTheme(cycleTheme())}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-border bg-surface text-ink hover:bg-surface-alt"
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      <span className="text-base leading-none">{icon}</span>
    </button>
  );
}
