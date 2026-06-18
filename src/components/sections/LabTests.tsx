import { Card, CardContent, Grid, TextField, InputAdornment, Box, Typography, Divider } from '@mui/material'
import { ScienceRounded, BloodtypeRounded, WaterDropRounded } from '@mui/icons-material'
import { SectionHeader } from '../ui/SectionHeader'
import { normalizeNumber } from '../../utils/number'
import { UrineSelect } from '../ui/UrineSelect'
import { useTr } from '../../hooks/useTr'
import { useSectionColors } from '../../hooks/useSectionColors'
import { useFormStore } from '../../store/formStore'
import type { StringKey } from '../../types/form'

interface BloodField {
  key: StringKey
  labelKey: keyof ReturnType<typeof useTr>
  unit: string
  ph: string
}

const BLOOD_FIELDS: BloodField[] = [
  { key: 'hgb',       labelKey: 'hgb',       unit: 'г/л',       ph: '110–150' },
  { key: 'rbc',       labelKey: 'rbc',       unit: '×10¹²/л',   ph: '3.5–5.0' },
  { key: 'wbc',       labelKey: 'wbc',       unit: '×10⁹/л',    ph: '4.0–9.0' },
  { key: 'plt',       labelKey: 'plt',       unit: '×10⁹/л',    ph: '150–400' },
  { key: 'glcBlood',  labelKey: 'glcBlood',  unit: 'ммоль/л',   ph: '3.3–5.5' },
  { key: 'ferritin',  labelKey: 'ferritin',  unit: 'нг/мл',     ph: '10–120'  },
  { key: 'iron',      labelKey: 'iron',      unit: 'мкмоль/л',  ph: '9–30'    },
  { key: 'alt',       labelKey: 'alt',       unit: 'Ед/л',      ph: '<40'     },
  { key: 'ast',       labelKey: 'ast',       unit: 'Ед/л',      ph: '<40'     },
  { key: 'creatinine',labelKey: 'creatinine',unit: 'мкмоль/л',  ph: '44–80'   },
]

export function LabTests() {
  const tr = useTr()
  const { lab } = useSectionColors()
  const { setField, ...form } = useFormStore()

  return (
    <Card sx={{ bgcolor: lab.bg }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <SectionHeader
          color={lab.accent}
          icon={<ScienceRounded sx={{ color: 'white', fontSize: 22 }} />}
          title={tr.s3}
        />

        {/* Blood tests */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BloodtypeRounded sx={{ color: lab.accent, fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: lab.accent }}>
            {tr.bloodTests}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {BLOOD_FIELDS.map(({ key, labelKey, unit, ph }) => (
            <Grid key={key} size={{ xs: 6, sm: 4 }}>
              <TextField
                fullWidth label={tr[labelKey] as string} placeholder={ph}
                type="number" value={form[key] as string}
                onChange={(e) => setField(key, e.target.value)}
                onBlur={() => setField(key, normalizeNumber(form[key] as string, { min: 0, allowDecimal: true }))}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ '& p': { fontSize: 11 } }}>
                        {unit}
                      </InputAdornment>
                    ),
                  },
                  htmlInput: { min: 0, step: 'any' },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 2.5 }} />

        {/* Urine tests */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <WaterDropRounded sx={{ color: lab.accent, fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: lab.accent }}>
            {tr.urineTests}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <UrineSelect fieldKey="protein" label={tr.protein} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <UrineSelect fieldKey="glcUrine" label={tr.glcUrine} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <UrineSelect fieldKey="ketones" label={tr.ketones} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
