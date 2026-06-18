import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColorMode } from '../types/lang'

interface ModeStore {
  mode: ColorMode
  toggleMode: () => void
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleMode: () => set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'app-color-mode' }
  )
)
