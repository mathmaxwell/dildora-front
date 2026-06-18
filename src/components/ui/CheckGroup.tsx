import { Grid, FormControlLabel, Checkbox, Typography, Box } from '@mui/material'
import { useFormStore } from '../../store/formStore'
import { useTr } from '../../hooks/useTr'
import type { CheckGroup as CheckGroupDef } from '../../config/formConfig'

export function CheckGroup({ group, accent }: { group: CheckGroupDef; accent: string }) {
  const tr = useTr()
  const setBool = useFormStore((s) => s.setBool)
  const state = useFormStore()

  return (
    <Box sx={{ mb: 1 }}>
      {group.titleTr && (
        <Typography variant="subtitle2" sx={{ color: accent, fontWeight: 600, mb: 0.5 }}>
          {tr[group.titleTr]}
        </Typography>
      )}
      <Grid container spacing={0}>
        {group.keys.map((key) => (
          <Grid key={key} size={{ xs: 6, sm: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={state[key]}
                  onChange={(e) => setBool(key, e.target.checked)}
                  sx={{ color: accent, '&.Mui-checked': { color: accent } }}
                />
              }
              label={<Typography fontSize={14}>{tr[key]}</Typography>}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
