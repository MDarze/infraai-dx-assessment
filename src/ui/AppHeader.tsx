import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleToggle } from "./LocaleToggle";
import { t } from "../i18n/t";

interface Props {
  onReset: () => void;
  onSettings: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function AppHeader({ onReset, onSettings, onBack, canGoBack }: Props) {
  return (
    <header className="sticky top-0 z-10 h-14 border-b border-border bg-bg">
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-ink">InfraAI</span>
          <span className="text-xs text-ink-muted">{t("app.title")}</span>
        </div>
        <div className="flex items-center gap-2">
          {canGoBack && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              {t("header.back")}
            </Button>
          )}
          <LocaleToggle />
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={onSettings}>
            {t("header.settings")}
          </Button>
          <Button variant="secondary" size="sm" onClick={onReset}>
            {t("header.reset")}
          </Button>
        </div>
      </div>
    </header>
  );
}
