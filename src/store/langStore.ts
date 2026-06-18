import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '../types/lang'

interface LangStore {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'ru',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'app-lang' }
  )
)
