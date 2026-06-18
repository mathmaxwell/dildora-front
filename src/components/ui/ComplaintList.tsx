import { Box, FormControlLabel, Checkbox, Collapse, TextField, Typography, Divider } from '@mui/material'
import { motion } from 'framer-motion'
import { useFormStore } from '../../store/formStore'
import { useTr } from '../../hooks/useTr'
import type { ComplaintKey } from '../../types/form'

export function ComplaintList({ keys, accent }: { keys: ComplaintKey[]; accent: string }) {
  const tr = useTr()
  const setComplaint = useFormStore((s) => s.setComplaint)
  const state = useFormStore()

  return (
    <Box sx={{ mt: 1 }}>
      <Divider sx={{ mb: 1 }} />
      {keys.map((key, i) => {
        const item = state[key]
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
          >
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.checked}
                    onChange={(e) => setComplaint(key, 'checked', e.target.checked)}
                    sx={{ color: accent, '&.Mui-checked': { color: accent } }}
                  />
                }
                label={<Typography fontWeight={500} fontSize={15}>{tr[key]}</Typography>}
              />
              <Collapse in={item.checked} unmountOnExit>
                <Box sx={{ pl: 5, pb: 1 }}>
                  <TextField
                    fullWidth size="small" placeholder={tr.note}
                    value={item.note}
                    onChange={(e) => setComplaint(key, 'note', e.target.value)}
                  />
                </Box>
              </Collapse>
            </Box>
          </motion.div>
        )
      })}
    </Box>
  )
}
