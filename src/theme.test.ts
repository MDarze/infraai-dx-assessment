import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getTheme, setTheme, getResolvedTheme } from "./theme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to system when no preference stored", () => {
    expect(getTheme()).toBe("system");
  });

  it("persists explicit choice", () => {
    setTheme("dark");
    expect(getTheme()).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("resolves system to light or dark", () => {
    setTheme("system");
    const r = getResolvedTheme();
    expect(r === "light" || r === "dark").toBe(true);
  });
});
