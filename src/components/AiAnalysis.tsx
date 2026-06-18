import {
  Box, Button, Dialog, DialogContent, DialogTitle,
  Typography, CircularProgress, Alert, IconButton,
  LinearProgress,
} from '@mui/material'
import { AutoAwesomeRounded, CloseRounded, ScienceRounded } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAiStore } from '../store/aiStore'
import { useFormStore } from '../store/formStore'
import { useLangStore } from '../store/langStore'
import { useModeStore } from '../store/modeStore'
import { useTr } from '../hooks/useTr'
import { buildPrompt, hasEnoughData } from '../services/promptBuilder'

const MotionButton = motion.create(Button)

export function AiAnalysis() {
  const tr = useTr()
  const { lang } = useLangStore()
  const { mode } = useModeStore()
  const { loading, text, error, analyze, clear } = useAiStore()
  const form = useFormStore()
  const dark = mode === 'dark'

  const [open, setOpen] = useState(false)

  const handleAnalyze = () => {
    clear()
    setOpen(true)
    const prompt = buildPrompt(form, tr, lang)
    analyze(prompt)
  }

  const handleClose = () => {
    if (loading) return // don't close while streaming
    setOpen(false)
    clear()
  }

  const hasData = hasEnoughData(form)

  return (
    <Box>
      {/* ── Trigger button ── */}
      <MotionButton
        variant="contained"
        size="large"
        fullWidth
        disabled={!hasData}
        onClick={handleAnalyze}
        startIcon={
          <motion.div
            animate={hasData ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 4 }}
          >
            <AutoAwesomeRounded />
          </motion.div>
        }
        whileHover={hasData ? { scale: 1.02 } : {}}
        whileTap={hasData ? { scale: 0.97 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        sx={{
          py: 1.8, fontSize: 16, fontWeight: 700, borderRadius: 3,
          background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
          boxShadow: hasData ? '0 4px 30px rgba(124,58,237,0.45)' : 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9 0%, #BE185D 100%)',
            boxShadow: '0 8px 40px rgba(124,58,237,0.6)',
          },
          '&.Mui-disabled': {
            background: dark ? '#2D2040' : '#E9E5F8',
          },
        }}
      >
        {tr.aiButton}
      </MotionButton>

      {!hasData && (
        <Typography variant="caption" color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          {tr.aiEmpty}
        </Typography>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                background: dark
                  ? 'linear-gradient(145deg, #1A0F40 0%, #160D33 100%)'
                  : 'linear-gradient(145deg, #F5F3FF 0%, #FDF2F8 100%)',
                border: `1px solid ${dark ? 'rgba(167,139,250,0.25)' : 'rgba(124,58,237,0.15)'}`,
                boxShadow: dark
                  ? '0 24px 80px rgba(0,0,0,0.7)'
                  : '0 24px 80px rgba(124,58,237,0.25)',
                overflow: 'hidden',
              },
              component: motion.div,
              initial: { opacity: 0, scale: 0.93, y: 30 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.95, y: 20 },
              transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            {/* Loading bar */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LinearProgress
                    sx={{
                      height: 3,
                      background: 'transparent',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #7C3AED, #DB2777)',
                      },
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title */}
            <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <motion.div
                    animate={{ rotate: loading ? 360 : [0, 10, -10, 0] }}
                    transition={loading
                      ? { duration: 2, repeat: Infinity, ease: 'linear' }
                      : { duration: 3, repeat: Infinity, repeatDelay: 2 }
                    }
                  >
                    <ScienceRounded sx={{
                      color: dark ? '#A78BFA' : '#7C3AED',
                      fontSize: 28,
                    }} />
                  </motion.div>
                  <Typography variant="h6" fontWeight={700}
                    sx={{ color: dark ? '#A78BFA' : '#7C3AED' }}>
                    {loading ? tr.aiLoading : tr.aiTitle}
                  </Typography>
                  {loading && (
                    <CircularProgress size={16} thickness={5}
                      sx={{ color: dark ? '#A78BFA' : '#7C3AED', ml: 0.5 }} />
                  )}
                </Box>

                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                  <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    <CloseRounded />
                  </IconButton>
                </motion.div>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 3 }}>
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Alert severity={error === 'RATE_LIMIT' ? 'warning' : 'error'}
                      sx={{ borderRadius: 2, mb: 2 }}>
                      {error === 'RATE_LIMIT' && (
                        lang === 'ru' ? '⏳ Слишком много запросов. Подождите ~1 минуту и попробуйте снова.'
                        : lang === 'uz' ? "⏳ Juda ko'p so'rov. ~1 daqiqa kuting."
                        : '⏳ Too many requests. Wait ~1 minute and try again.'
                      )}
                      {error === 'NO_KEY' && (
                        lang === 'ru' ? '🔑 GROQ_API_KEY не найден. Добавьте в файл .env'
                        : lang === 'uz' ? "🔑 GROQ_API_KEY topilmadi. .env fayliga qo'shing"
                        : '🔑 GROQ_API_KEY not found. Add it to .env file'
                      )}
                      {error !== 'RATE_LIMIT' && error !== 'NO_KEY' && `${tr.aiError}: ${error}`}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Streamed text */}
              {text && (
                <Typography
                  component="pre"
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    fontFamily: '"Roboto", sans-serif',
                    lineHeight: 2, fontSize: 14.5,
                    color: 'text.primary', m: 0,
                  }}
                >
                  {text}
                  {loading && (
                    <Box component="span" sx={{
                      display: 'inline-block',
                      width: 8, height: 16,
                      bgcolor: dark ? '#A78BFA' : '#7C3AED',
                      ml: 0.5, mb: '-3px', borderRadius: 0.5,
                      animation: 'blink 1s step-end infinite',
                      '@keyframes blink': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0 },
                      },
                    }} />
                  )}
                </Typography>
              )}

              {/* Empty state while loading first chunk */}
              {loading && !text && !error && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CircularProgress size={48} thickness={3}
                      sx={{ color: dark ? '#A78BFA' : '#7C3AED' }} />
                  </motion.div>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  )
}
