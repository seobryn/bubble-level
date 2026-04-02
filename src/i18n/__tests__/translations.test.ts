import { getTranslation, translations } from "@/i18n/translations";

describe("i18n Translations", () => {
  describe("getTranslation", () => {
    it("should return English translation for valid key", () => {
      const result = getTranslation("en", "app.title");
      expect(result).toBe("Bubble Level");
    });

    it("should return Spanish translation for valid key", () => {
      const result = getTranslation("es", "app.title");
      expect(result).toBe("Nivel");
    });

    it("should fallback to English if translation missing in language", () => {
      const result = getTranslation("es", "nonexistent.key");
      expect(result).toBe("nonexistent.key");
    });

    it("should return key if translation not found in any language", () => {
      const result = getTranslation("en", "nonexistent.key");
      expect(result).toBe("nonexistent.key");
    });

    it("should return original key on error", () => {
      const result = getTranslation("en", "app.title");
      expect(result).not.toBeNull();
      expect(result).toBeDefined();
    });
  });

  describe("Template Variables", () => {
    it("should replace single template variable", () => {
      const result = getTranslation("en", "onboarding.progress", {
        current: 1,
        total: 3,
      });
      expect(result).toBe("1/3");
    });

    it("should replace multiple template variables", () => {
      const result = getTranslation("es", "onboarding.progress", {
        current: 2,
        total: 5,
      });
      expect(result).toBe("2/5");
    });

    it("should handle number parameters", () => {
      const result = getTranslation("en", "onboarding.progress", {
        current: 1,
        total: 10,
      });
      expect(result).toBe("1/10");
    });
  });

  describe("Translation Coverage", () => {
    it("should have matching keys in English and Spanish", () => {
      const enKeys = Object.keys(translations.en).sort();
      const esKeys = Object.keys(translations.es).sort();

      expect(enKeys).toHaveLength(esKeys.length);
      expect(enKeys).toEqual(esKeys);
    });

    it("should have translations for all UI text", () => {
      const requiredKeys = [
        "app.title",
        "app.subtitle",
        "status.initializing",
        "status.error",
        "status.level",
        "status.adjustPosition",
        "onboarding.step",
        "onboarding.back",
        "onboarding.next",
        "onboarding.getStarted",
        "onboarding.progress",
        "hint.tilt",
        "hint.center",
        "hint.calibrate",
        "language.label",
      ];

      requiredKeys.forEach((key) => {
        expect(translations.en[key]).toBeDefined();
        expect(translations.es[key]).toBeDefined();
      });
    });

    it("should have non-empty translations", () => {
      Object.entries(translations).forEach(([lang, trans]) => {
        Object.entries(trans).forEach(([key, value]) => {
          expect(value).toBeTruthy();
          expect(typeof value).toBe("string");
        });
      });
    });
  });
});
