import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import { useFormStore } from '../../store/formStore'
import { useTr } from '../../hooks/useTr'
import { US_ROWS } from '../../config/formConfig'
import type { USKey } from '../../types/form'

export function UltrasoundTable({ accent }: { accent: string }) {
  const tr = useTr()
  const setUS = useFormStore((s) => s.setUS)
  const state = useFormStore()

  return (
    <Box sx={{ mb: 2 }}>
      {/* header row */}
      <Box sx={{ display: 'flex', gap: 1, px: 0.5, mb: 1 }}>
        <Box sx={{ flex: 1.4 }} />
        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: 13, color: accent, textAlign: 'center' }}>
          {tr.usTrimester1}
        </Typography>
        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: 13, color: accent, textAlign: 'center' }}>
          {tr.usTrimester2}
        </Typography>
      </Box>

      {US_ROWS.map((row) => {
        const key = row.id as USKey
        const val = state[key]
        const unit = row.unit ? tr[row.unit] : undefined
        return (
          <Box key={row.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.75 }}>
            <Typography sx={{ flex: 1.3, fontSize: 13, lineHeight: 1.2 }}>{tr[row.tr]}</Typography>
            {(['t1', 't2'] as const).map((t) => (
              <TextField
                key={t}
                size="small" type="number" value={val[t]}
                onChange={(e) => setUS(key, t, e.target.value)}
                sx={{ flex: 1 }}
                slotProps={{
                  htmlInput: { step: 'any', inputMode: 'decimal' },
                  input: unit
                    ? { endAdornment: <InputAdornment position="end" sx={{ '& p': { fontSize: 10 } }}>{unit}</InputAdornment> }
                    : undefined,
                }}
              />
            ))}
          </Box>
        )
      })}
    </Box>
  )
}
