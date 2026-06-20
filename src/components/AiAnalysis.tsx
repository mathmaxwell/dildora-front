import { Box, Button, Typography } from '@mui/material'
import { AutoAwesomeRounded } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useFormStore } from '../store/formStore'
import { useModeStore } from '../store/modeStore'
import { useTr } from '../hooks/useTr'
import { hasEnoughData } from '../services/promptBuilder'
import { AiAnalysisDialog } from './AiAnalysisDialog'

const MotionButton = motion.create(Button)

export function AiAnalysis() {
  const tr = useTr()
  const { mode } = useModeStore()
  const form = useFormStore()
  const dark = mode === 'dark'

  const [open, setOpen] = useState(false)
  const hasData = hasEnoughData(form)

  return (
    <Box>
      {/* ── Trigger button ── */}
      <MotionButton
        variant="contained"
        size="large"
        fullWidth
        disabled={!hasData}
        onClick={() => setOpen(true)}
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

      <AiAnalysisDialog open={open} onClose={() => setOpen(false)} form={form} />
    </Box>
  )
}
