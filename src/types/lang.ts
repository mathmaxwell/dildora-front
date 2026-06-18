export type Lang = 'uz' | 'ru' | 'en'
export type ColorMode = 'light' | 'dark'

/**
 * Flat translation dictionary. Keys are referenced dynamically from the form
 * config (field ids, option ids, units, section/group titles), so an index
 * signature is used. The structural keys below are always required.
 */
export interface Translations {
  [key: string]: string
  appTitle: string
  aiButton: string
  aiLoading: string
  aiTitle: string
  aiError: string
  aiEmpty: string
  aiClear: string
}
