# Internationalization (i18n) Guide

This app uses a custom internationalization system to support multiple languages (English and Spanish).

## Architecture

### Files Structure

```
src/
  i18n/
    translations.ts        # Translation strings and language utilities
    language-context.tsx   # React Context for language management
    use-translation.ts     # Custom hook for accessing translations
  components/
    language-selector.tsx  # Language switcher UI component
```

## How It Works

### 1. Translations File (`src/i18n/translations.ts`)

Contains all translation strings organized by language:

```typescript
export const translations: Record<Language, Translations> = {
  en: {
    "app.title": "Bubble Level",
    "status.level": "✓ Level",
  },
  es: {
    "app.title": "Nivel de Burbuja",
    "status.level": "✓ Nivel",
  },
};
```

**Features:**

- Dot-notation keys for namespace organization (e.g., `app.title`, `status.level`)
- Template support with `{{variable}}` syntax for dynamic content
- Fallback to English if translation missing

### 2. Language Context (`src/i18n/language-context.tsx`)

Manages current language state and persistence:

```typescript
export type LanguageContextType = {
  language: Language;        // Current language: "en" or "es"
  setLanguage: (language: Language) => Promise<void>;  // Change language
  t: (key: string, params?: {...}) => string;  // Get translation
};
```

**Features:**

- Stores language preference in AsyncStorage
- Automatically loads saved preference on app start
- Provides `t()` function for accessing translations

### 3. Translation Hook (`src/i18n/use-translation.ts`)

Simple wrapper around `useLanguage()` for semantic clarity.

### 4. Language Provider

Wraps the entire app in `src/app/_layout.tsx`:

```typescript
<LanguageProvider>
  <ThemeProvider>
    <Slot />
  </ThemeProvider>
</LanguageProvider>
```

### 5. Language Selector (`src/components/language-selector.tsx`)

UI component to switch languages with visual feedback.

## Usage in Components

### Basic Translation

```typescript
import { useTranslation } from "@/i18n/use-translation";

export function MyComponent() {
  const { t } = useTranslation();

  return <Text>{t("app.title")}</Text>;
}
```

### Translation with Parameters

```typescript
const { t } = useTranslation();
return <Text>{t("onboarding.progress", { current: 1, total: 3 })}</Text>;
// Output: "1/3"
```

### Changing Language

```typescript
const { setLanguage } = useTranslation();
await setLanguage("es"); // Switch to Spanish
```

## Adding New Translations

### Step 1: Add to translations.ts

```typescript
export const translations: Record<Language, Translations> = {
  en: {
    // ... existing translations
    "myfeature.text": "My Feature Text",
  },
  es: {
    // ... existing translations
    "myfeature.text": "Texto de Mi Función",
  },
};
```

### Step 2: Use in Component

```typescript
const { t } = useTranslation();
return <Text>{t("myfeature.text")}</Text>;
```

## Current Translations

| Key                     | English                                                 | Spanish                                                       |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `app.title`             | Bubble Level                                            | Nivel de Burbuja                                              |
| `app.subtitle`          | Tilt the device and keep the bubble on the center cross | Inclina el dispositivo y mantén la burbuja en la cruz central |
| `status.initializing`   | Initializing...                                         | Inicializando...                                              |
| `status.error`          | Error                                                   | Error                                                         |
| `status.level`          | ✓ Level                                                 | ✓ Nivel                                                       |
| `status.adjustPosition` | Adjust Position                                         | Ajusta la Posición                                            |
| `onboarding.step`       | Step                                                    | Paso                                                          |
| `onboarding.back`       | ← Back                                                  | ← Atrás                                                       |
| `onboarding.next`       | Next →                                                  | Siguiente →                                                   |
| `onboarding.getStarted` | Get Started →                                           | Comenzar →                                                    |
| `onboarding.progress`   | {{current}}/{{total}}                                   | {{current}}/{{total}}                                         |
| `hint.tilt`             | Tilt your device to move the bubble.                    | Inclina tu dispositivo para mover la burbuja.                 |
| `hint.center`           | Keep the bubble on the center cross.                    | Mantén la burbuja en la cruz central.                         |
| `hint.calibrate`        | Tap calibrate on a known level surface.                 | Toca calibrar en una superficie conocida como plana.          |
| `language.label`        | 🌐 Language                                             | 🌐 Idioma                                                     |

## Language Persistence

- Current language is saved to AsyncStorage key: `app-language`
- Persists across app restarts
- Loads automatically on app startup
- Falls back to English if no preference saved

## Supported Languages

- English (`en`)
- Spanish (`es`)

To add a new language:

1. Create new language entry in `translations.ts`
2. Update `Language` type to include new language code
3. Update language selector options in `language-selector.tsx`

## API Reference

### `useTranslation()`

```typescript
const { language, setLanguage, t } = useTranslation();

// Properties
language: "en" | "es"              // Current language
setLanguage: (lang: Language) => Promise<void>  // Change language
t: (key: string, params?: {...}) => string     // Get translation
```

### `LanguageProvider`

```typescript
<LanguageProvider defaultLanguage="en">
  {children}
</LanguageProvider>
```

**Props:**

- `defaultLanguage` (optional): Initial language if no saved preference. Default: `"en"`

### `getTranslation(language, key, params?)`

Low-level function for getting translations directly:

```typescript
import { getTranslation } from "@/i18n/translations";

const text = getTranslation("es", "app.title"); // "Nivel de Burbuja"
```

## Best Practices

1. **Use semantic keys**: `app.title` instead of `title`
2. **Group related translations**: `status.*`, `onboarding.*`
3. **Use parameters for dynamic content**: `t("count.total", { count: 5 })`
4. **Keep translations synchronized**: Add both EN and ES translations
5. **Test translations**: Especially with different text lengths

## Testing Translations

To test a specific language:

```typescript
import { getTranslation } from "@/i18n/translations";

test("Spanish translation exists", () => {
  const text = getTranslation("es", "app.title");
  expect(text).toBe("Nivel de Burbuja");
});
```

## Performance Notes

- Language changes trigger re-renders only for components using `useTranslation()`
- AsyncStorage operations are async (non-blocking)
- Context provider prevents unnecessary re-renders of unrelated components
