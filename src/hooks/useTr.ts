import { useLangStore } from '../store/langStore'
import { translations } from '../i18n'
import type { Translations } from '../types/lang'

export function useTr(): Translations {
  const lang = useLangStore((s) => s.lang)
  return translations[lang]
}
