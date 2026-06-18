import { ThemeProvider, CssBaseline } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import { AppHeader } from './components/AppHeader'
import { HomePage } from './pages/HomePage'
import { AnimatedBackground } from './components/AnimatedBackground'
import { useAppTheme } from './hooks/useAppTheme'
import { useModeStore } from './store/modeStore'

export default function App() {
  const theme = useAppTheme()
  const { mode } = useModeStore()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <AnimatedBackground key={mode} />
      </AnimatePresence>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AppHeader />
        <HomePage />
      </div>
    </ThemeProvider>
  )
}
