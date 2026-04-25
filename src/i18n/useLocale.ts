import { useSyncExternalStore } from "react";
import { getLocale, setLocale, subscribeLocale, type Locale } from "./t";

export function useLocale(): [Locale, (l: Locale) => void] {
  const loc = useSyncExternalStore(
    (cb) => subscribeLocale(cb),
    () => getLocale(),
    () => "ar" as Locale
  );
  return [loc, setLocale];
}
