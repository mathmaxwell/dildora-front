import { create } from 'zustand'
import { streamAnalysis } from '../services/geminiService'

interface AiStore {
  loading: boolean
  text: string
  error: string | null
  analyze: (prompt: string) => Promise<void>
  clear: () => void
}

export const useAiStore = create<AiStore>((set) => ({
  loading: false,
  text: '',
  error: null,

  analyze: async (prompt) => {
    set({ loading: true, text: '', error: null })
    try {
      for await (const chunk of streamAnalysis(prompt)) {
        set((s) => ({ text: s.text + chunk }))
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      set({ error: msg === 'RATE_LIMIT' ? 'RATE_LIMIT' : msg })
    } finally {
      set({ loading: false })
    }
  },

  clear: () => set({ text: '', error: null }),
}))
