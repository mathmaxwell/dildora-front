import { useMemo } from 'react'
import { useModeStore } from '../store/modeStore'
import { createAppTheme } from '../theme/createAppTheme'

export function useAppTheme() {
  const mode = useModeStore((s) => s.mode)
  return useMemo(() => createAppTheme(mode), [mode])
}
