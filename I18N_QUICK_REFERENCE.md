# Internationalization Quick Reference

## 🚀 Quick Start

### Using translations in a component:

```typescript
import { useTranslation } from "@/i18n/use-translation";

export function MyComponent() {
  const { t, language } = useTranslation();

  return <Text>{t("app.title")}</Text>;
}
```

### Changing the language:

```typescript
const { setLanguage } = useTranslation();
await setLanguage("es"); // Switch to Spanish
await setLanguage("en"); // Switch to English
```

### Using template variables:

```typescript
const { t } = useTranslation();

// Translation key: "onboarding.progress": "{{current}}/{{total}}"
return <Text>{t("onboarding.progress", { current: 1, total: 3 })}</Text>;
// Output: "1/3"
```

## 🗂️ File Structure

```
src/i18n/
├── translations.ts          # All translation strings
├── language-context.tsx     # React Context provider
├── use-translation.ts       # Hook for accessing translations
└── __tests__/
    └── translations.test.ts # Tests for i18n system

components/
└── language-selector.tsx    # Language switcher UI
```

## 🌐 Supported Languages

| Language | Code |
| -------- | ---- |
| English  | `en` |
| Spanish  | `es` |

## 📋 Translation Keys By Feature

### **App**

- `app.title` - Main app title
- `app.subtitle` - App subtitle/description

### **Status Indicators**

- `status.initializing` - Loading state
- `status.error` - Error state
- `status.level` - Success/level detected
- `status.adjustPosition` - Position adjustment needed

### **Onboarding**

- `onboarding.step` - "Step" prefix
- `onboarding.back` - Back button
- `onboarding.next` - Next button
- `onboarding.getStarted` - Start/complete button
- `onboarding.progress` - Progress counter (supports {{current}}/{{total}})

### **Hints**

- `hint.tilt` - Tilt device hint
- `hint.center` - Center bubble hint
- `hint.calibrate` - Calibration hint

### **Language**

- `language.label` - Language selector label
- `settings.language` - Settings language label

## 🔧 Adding a New Translation

1. **Add English translation** in `src/i18n/translations.ts`:

```typescript
export const translations: Record<Language, Translations> = {
  en: {
    "feature.newText": "New text here",
  },
  es: {
    "feature.newText": "Nuevo texto aquí",
  },
};
```

2. **Use in component**:

```typescript
const { t } = useTranslation();
return <Text>{t("feature.newText")}</Text>;
```

## 🧪 Testing

Run translation tests:

```bash
npm test -- i18n/translations
```

## 💾 Persistence

- Language preference auto-saved to device
- Loaded on app startup
- Stored in AsyncStorage with key: `app-language`

## 🎯 Key Features

✅ **Easy to use** - Simple `t()` function
✅ **Type-safe** - Language types enforce "en" | "es"
✅ **Persistent** - Saves preference across sessions
✅ **Fallback** - Falls back to English if translation missing
✅ **Template support** - Dynamic text with `{{variable}}`
✅ **Complete coverage** - All app text translated
✅ **UI selector** - Built-in language switcher component

## 🔍 Debugging

Check current language:

```typescript
const { language } = useTranslation();
console.log(`Current language: ${language}`);
```

Verify translation exists:

```typescript
import { getTranslation } from "@/i18n/translations";
const text = getTranslation("es", "app.title");
console.log(text);
```

## 📚 More Info

See [docs/I18N_GUIDE.md](../docs/I18N_GUIDE.md) for complete documentation.
