import { useLanguage } from "@/i18n/language-context";

/**
 * Alias for useLanguage hook for semantic clarity
 * Use this hook to access translations in components
 *
 * @example
 * const { t } = useTranslation();
 * return <Text>{t('app.title')}</Text>;
 */
export function useTranslation() {
  return useLanguage();
}
