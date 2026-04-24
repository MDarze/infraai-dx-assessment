export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const KEY = "infraai_theme";

export function getTheme(): Theme {
  const v = localStorage.getItem(KEY);
  return v === "light" || v === "dark" ? v : "system";
}

function systemPref(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getResolvedTheme(): ResolvedTheme {
  const t = getTheme();
  return t === "system" ? systemPref() : t;
}

export function setTheme(t: Theme): void {
  if (t === "system") localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, t);
  document.documentElement.setAttribute("data-theme", t === "system" ? systemPref() : t);
}

export function cycleTheme(): Theme {
  const cur = getTheme();
  const next: Theme = cur === "system" ? "light" : cur === "light" ? "dark" : "system";
  setTheme(next);
  return next;
}
