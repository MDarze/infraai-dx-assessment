import { describe, it, expect, beforeEach } from "vitest";
import { t, setLocale } from "./t";

describe("t()", () => {
  beforeEach(() => {
    localStorage.clear();
    setLocale("ar");
  });

  it("returns Arabic by default", () => {
    expect(t("start.begin")).toBe("بدء التقييم");
  });

  it("returns English after switch", () => {
    setLocale("en");
    expect(t("start.begin")).toBe("Start assessment");
  });

  it("interpolates placeholders", () => {
    setLocale("en");
    expect(t("survey.meta.count", { n: 3, total: 24 })).toBe("Question 3 / 24");
  });

  it("returns key on miss", () => {
    // @ts-expect-error intentional bad key
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });
});
