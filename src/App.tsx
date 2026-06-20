import { ThemeProvider, CssBaseline } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { HomePage } from './pages/HomePage'
import { CardsPage } from './pages/CardsPage'
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}
