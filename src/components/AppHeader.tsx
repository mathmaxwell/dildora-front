import { useState } from 'react'
import { AppBar, Toolbar, Box, Typography, ToggleButtonGroup, ToggleButton, IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7, FavoriteRounded, FolderOpenRounded } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useLangStore } from '../store/langStore'
import { useModeStore } from '../store/modeStore'
import { useTr } from '../hooks/useTr'
import { CardsList } from './CardsList'
import type { Lang } from '../types/lang'

const MotionIconButton = motion.create(IconButton)

export function AppHeader() {
  const tr = useTr()
  const { lang, setLang } = useLangStore()
  const { mode, toggleMode } = useModeStore()
  const dark = mode === 'dark'
  const [listOpen, setListOpen] = useState(false)

  return (
    <>
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <AppBar position="sticky" elevation={0} sx={{
        background: dark
          ? 'linear-gradient(135deg, #3B0764 0%, #831843 100%)'
          : 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
        backdropFilter: 'blur(12px)',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <FavoriteRounded sx={{ color: 'rgba(255,255,255,0.95)', fontSize: 28 }} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tr.appTitle}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                <Typography variant="h6" fontWeight={700} color="white" sx={{ letterSpacing: 0.3 }}>
                  {tr.appTitle}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={tr.listButton}>
              <MotionIconButton
                onClick={() => setListOpen(true)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
                sx={{ color: 'white' }}
              >
                <FolderOpenRounded />
              </MotionIconButton>
            </Tooltip>

            <ToggleButtonGroup
              value={lang}
              exclusive
              size="small"
              onChange={(_, v) => v && setLang(v as Lang)}
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(255,255,255,0.25)',
                  fontSize: 13, px: 1.5, py: 0.5,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.22)',
                    borderColor: 'rgba(255,255,255,0.4)',
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              {(['uz', 'ru', 'en'] as Lang[]).map((l) => (
                <ToggleButton key={l} value={l}>
                  {l.toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Tooltip title={dark ? 'Light mode' : 'Dark mode'}>
              <MotionIconButton
                onClick={toggleMode}
                whileHover={{ rotate: 20, scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
                sx={{ color: 'white', ml: 0.5 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {dark ? <Brightness7 /> : <Brightness4 />}
                  </motion.div>
                </AnimatePresence>
              </MotionIconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>

    <CardsList open={listOpen} onClose={() => setListOpen(false)} />
    </>
  )
}
