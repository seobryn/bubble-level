export type Language = "en" | "es";

export type Translations = {
  [key: string]: string;
};

export const translations: Record<Language, Translations> = {
  en: {
    // Home Screen
    "app.title": "Bubble Level",
    "app.subtitle": "Tilt the device and keep the bubble on the center cross",

    // Status Indicators
    "status.initializing": "Initializing...",
    "status.error": "Error",
    "status.level": "✓ Level",
    "status.adjustPosition": "Adjust Position",

    // Onboarding Steps
    "onboarding.step": "Step",
    "onboarding.back": "← Back",
    "onboarding.next": "Next →",
    "onboarding.getStarted": "Get Started →",
    "onboarding.progress": "{{current}}/{{total}}",

    // Onboarding Hints
    "hint.tilt": "Tilt your device to move the bubble.",
    "hint.center": "Keep the bubble on the center cross.",
    "hint.calibrate": "Tap calibrate on a known level surface.",

    // Settings / Language
    "settings.language": "Language",
    "settings.english": "English",
    "settings.spanish": "Español",
    "language.label": "🌐 Language",

    // Angle Display
    "angle.toggle": "Angle",
    "angle.pitch": "Pitch",
    "angle.roll": "Roll",

    // Premium
    "premium.removeAds": "Remove Ads",
  },
  es: {
    // Pantalla principal
    "app.title": "Nivel",
    "app.subtitle":
      "Inclina el dispositivo y mantén la burbuja en la cruz central",

    // Indicadores de estado
    "status.initializing": "Inicializando...",
    "status.error": "Error",
    "status.level": "✓ Nivel",
    "status.adjustPosition": "Ajusta la Posición",

    // Pasos de incorporación
    "onboarding.step": "Paso",
    "onboarding.back": "← Atrás",
    "onboarding.next": "Siguiente →",
    "onboarding.getStarted": "Comenzar →",
    "onboarding.progress": "{{current}}/{{total}}",

    // Consejos de incorporación
    "hint.tilt": "Inclina tu dispositivo para mover la burbuja.",
    "hint.center": "Mantén la burbuja en la cruz central.",
    "hint.calibrate": "Toca calibrar en una superficie conocida como plana.",

    // Configuración / Idioma
    "settings.language": "Idioma",
    "settings.english": "English",
    "settings.spanish": "Español",
    "language.label": "🌐 Idioma",

    // Pantalla de ángulo
    "angle.toggle": "Ángulo",
    "angle.pitch": "Inclinación",
    "angle.roll": "Giro",

    // Premium
    "premium.removeAds": "Quitar Anuncios",
  },
};

export function getTranslation(
  language: Language,
  key: string,
  params?: Record<string, string | number>,
): string {
  let text = translations[language][key] || translations["en"][key] || key;

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{{${param}}}`, String(value));
    });
  }

  return text;
}
