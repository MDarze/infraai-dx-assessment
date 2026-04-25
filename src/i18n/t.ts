import { ar } from "./ar";
import { en } from "./en";

export type Locale = "ar" | "en";
const dicts = { ar, en } as const;
export type Key = keyof typeof ar;

const KEY = "infraai_locale";
let current: Locale = readInitial();

function readInitial(): Locale {
  const v = typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null;
  return v === "en" ? "en" : "ar";
}

export function getLocale(): Locale {
  return current;
}

export function setLocale(loc: Locale): void {
  current = loc;
  try {
    localStorage.setItem(KEY, loc);
  } catch {}
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", loc);
    document.documentElement.setAttribute("dir", loc === "en" ? "ltr" : "rtl");
  }
  listeners.forEach((l) => l(loc));
}

type Listener = (loc: Locale) => void;
const listeners = new Set<Listener>();
export function subscribeLocale(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function t(key: Key, vars?: Record<string, string | number>): string {
  const dict = dicts[current] as Record<string, string>;
  let s = dict[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return s;
}
