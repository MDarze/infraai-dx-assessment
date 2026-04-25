// src/ui/LocaleToggle.tsx
import { useLocale } from "../i18n/useLocale";
import { Segmented } from "./Segmented";

export function LocaleToggle() {
  const [loc, setLoc] = useLocale();
  return (
    <Segmented
      value={loc}
      options={[
        { value: "ar", label: "AR" },
        { value: "en", label: "EN" },
      ]}
      onChange={(v) => setLoc(v as "ar" | "en")}
      ariaLabel="Language"
    />
  );
}
