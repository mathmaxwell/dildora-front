import {
  Box, Dialog, DialogContent, DialogTitle,
  Typography, CircularProgress, Alert, IconButton, LinearProgress,
} from '@mui/material'
import { CloseRounded, ScienceRounded } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useAiStore } from '../store/aiStore'
import { useLangStore } from '../store/langStore'
import { useModeStore } from '../store/modeStore'
import { useTr } from '../hooks/useTr'
import { buildPrompt } from '../services/promptBuilder'
import type { FormState } from '../types/form'

interface Props {
  open: boolean
  onClose: () => void
  form: FormState | null
}

/**
 * Модалка AI-анализа. При открытии сама строит промпт из переданной формы
 * и запускает стриминг. Используется и на форме (текущая карта), и в списке
 * пациентов (быстрый анализ выбранной карты).
 */
export function AiAnalysisDialog({ open, onClose, form }: Props) {
  const tr = useTr()
  const { lang } = useLangStore()
  const { mode } = useModeStore()
  const { loading, text, error, analyze, clear } = useAiStore()
  const dark = mode === 'dark'

  // Запускаем анализ при каждом открытии.
  useEffect(() => {
    if (open && form) {
      clear()
      analyze(buildPrompt(form, tr, lang))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClose = () => {
    if (loading) return // не закрываем во время стриминга
    clear()
    onClose()
  }

  return (
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                  <ScienceRounded sx={{ color: dark ? '#A78BFA' : '#7C3AED', fontSize: 28 }} />
                </motion.div>
                <Typography variant="h6" fontWeight={700} sx={{ color: dark ? '#A78BFA' : '#7C3AED' }}>
                  {loading ? tr.aiLoading : tr.aiTitle}
                </Typography>
                {loading && (
                  <CircularProgress size={16} thickness={5}
                    sx={{ color: dark ? '#A78BFA' : '#7C3AED', ml: 0.5 }} />
                )}
              </Box>

              <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                <IconButton onClick={handleClose} disabled={loading} size="small"
                  sx={{ color: 'text.secondary' }}>
                  <CloseRounded />
                </IconButton>
              </motion.div>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 3, pb: 3 }}>
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Alert severity={error === 'RATE_LIMIT' ? 'warning' : 'error'}
                    sx={{ borderRadius: 2, mb: 2 }}>
                    {error === 'RATE_LIMIT' && (
                      lang === 'ru' ? '⏳ Слишком много запросов. Подождите ~1 минуту и попробуйте снова.'
                      : lang === 'uz' ? "⏳ Juda ko'p so'rov. ~1 daqiqa kuting."
                      : '⏳ Too many requests. Wait ~1 minute and try again.'
                    )}
                    {error === 'NO_KEY' && (
                      lang === 'ru' ? '🔑 AI временно недоступен (ключ не настроен на сервере).'
                      : lang === 'uz' ? '🔑 AI vaqtincha ishlamayapti (serverda kalit sozlanmagan).'
                      : '🔑 AI is temporarily unavailable (key not configured on the server).'
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
                    display: 'inline-block', width: 8, height: 16,
                    bgcolor: dark ? '#A78BFA' : '#7C3AED',
                    ml: 0.5, mb: '-3px', borderRadius: 0.5,
                    animation: 'blink 1s step-end infinite',
                    '@keyframes blink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
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
  )
}
