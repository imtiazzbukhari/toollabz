import { describe, expect, it } from "vitest";
import { LOCALES, NON_DEFAULT_LOCALES } from "../lib/i18n/locales";
import { getWorkspaceMessages, WORKSPACE_MESSAGES } from "../lib/i18n/workspace-messages";
import { getUiMessages } from "../lib/i18n/ui-messages";

describe("localized workspace chrome", () => {
  it("covers every locale with a distinct Calculate label", () => {
    expect(Object.keys(WORKSPACE_MESSAGES).sort()).toEqual([...LOCALES].sort());
    const english = getWorkspaceMessages("en");
    expect(english.calculate).toBe("Calculate");
    for (const locale of NON_DEFAULT_LOCALES) {
      const ws = getWorkspaceMessages(locale);
      expect(ws.calculate, locale).not.toBe(english.calculate);
      expect(ws.copy, locale).not.toBe(english.copy);
      expect(ws.yourResults, locale).not.toBe(english.yourResults);
      expect(ws.subscribe, locale).not.toBe(english.subscribe);
    }
  });

  it("language switcher label is translated", () => {
    expect(getUiMessages("fr").nav.language).toBe("Langue");
    expect(getUiMessages("es").nav.language).toBe("Idioma");
    expect(getUiMessages("cs").nav.language).not.toBe(getUiMessages("en").nav.language);
  });
});
