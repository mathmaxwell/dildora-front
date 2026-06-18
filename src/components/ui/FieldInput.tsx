import {
  TextField, InputAdornment, MenuItem, ToggleButtonGroup, ToggleButton, Box, Typography,
} from '@mui/material'
import { useFormStore } from '../../store/formStore'
import { useTr } from '../../hooks/useTr'
import { normalizeNumber } from '../../utils/number'
import type { FieldDef, Opt } from '../../config/formConfig'
import type { StringKey } from '../../types/form'

/** Resolve an option label: '#literal' → literal, otherwise an i18n key. */
function optLabel(opt: Opt, tr: ReturnType<typeof useTr>): string {
  return opt.tr.startsWith('#') ? opt.tr.slice(1) : (tr[opt.tr] ?? opt.tr)
}

function BmiField() {
  const tr = useTr()
  const weight = useFormStore((s) => s.weight)
  const height = useFormStore((s) => s.height)
  const w = parseFloat(weight)
  const h = parseFloat(height)
  let value = ''
  let category = ''
  if (w > 0 && h > 0) {
    const bmi = w / Math.pow(h / 100, 2)
    value = bmi.toFixed(1)
    category =
      bmi < 18.5 ? tr.bmiUnderweight
      : bmi < 25 ? tr.bmiNormal
      : bmi < 30 ? tr.bmiOver
      : bmi < 35 ? tr.bmiObese1
      : bmi < 40 ? tr.bmiObese2
      : tr.bmiObese3
  }
  return (
    <TextField
      fullWidth label={tr.bmi} value={value} placeholder="—"
      slotProps={{ input: { readOnly: true } }}
      helperText={category || ' '}
    />
  )
}

function BpField() {
  const tr = useTr()
  const sys = useFormStore((s) => s.bpSystolic)
  const dia = useFormStore((s) => s.bpDiastolic)
  const setField = useFormStore((s) => s.setField)
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
        {tr.bp} ({tr.bpUnit})
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 340 }}>
        <TextField
          size="small" label={tr.bpSystolic} placeholder="120" type="number" value={sys}
          onChange={(e) => setField('bpSystolic', e.target.value)}
          onBlur={() => setField('bpSystolic', normalizeNumber(sys, { min: 50, max: 250 }))}
          slotProps={{ htmlInput: { min: 50, max: 250, inputMode: 'numeric' } }} sx={{ flex: 1 }}
        />
        <Typography variant="h5" color="text.secondary" sx={{ userSelect: 'none', lineHeight: 1 }}>/</Typography>
        <TextField
          size="small" label={tr.bpDiastolic} placeholder="80" type="number" value={dia}
          onChange={(e) => setField('bpDiastolic', e.target.value)}
          onBlur={() => setField('bpDiastolic', normalizeNumber(dia, { min: 30, max: 150 }))}
          slotProps={{ htmlInput: { min: 30, max: 150, inputMode: 'numeric' } }} sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  )
}

export function FieldInput({ def }: { def: FieldDef }) {
  const tr = useTr()
  const key = def.id as StringKey
  const value = useFormStore((s) => (def.type === 'bp' || def.type === 'bmi' ? '' : (s[key] as string)))
  const setField = useFormStore((s) => s.setField)

  if (def.type === 'bmi') return <BmiField />
  if (def.type === 'bp') return <BpField />

  const label = tr[def.id] ?? def.id
  const unitAdornment = def.unit
    ? { endAdornment: <InputAdornment position="end" sx={{ '& p': { fontSize: 12 } }}>{tr[def.unit]}</InputAdornment> }
    : undefined

  if (def.type === 'toggle') {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>{label}</Typography>
        <ToggleButtonGroup
          value={value} exclusive size="small"
          onChange={(_, v) => v !== null && setField(key, v)}
        >
          {def.opts?.map((o) => (
            <ToggleButton key={o.value} value={o.value} sx={{ px: 2 }}>{optLabel(o, tr)}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    )
  }

  const isSelect = def.type === 'select'
  const isMultiline = def.type === 'textarea'
  // The phone field is plain text in the store, but on a phone it should pop
  // the number pad — not the full QWERTY keyboard.
  const isPhone = def.id === 'phone'

  // Pick the right on-screen keyboard so users aren't fighting the wrong one.
  const inputMode: 'decimal' | 'numeric' | 'tel' | undefined =
    def.type === 'number'
      ? (def.step === 'any' ? 'decimal' : 'numeric')
      : isPhone
        ? 'tel'
        : undefined

  return (
    <TextField
      fullWidth
      select={isSelect}
      multiline={isMultiline}
      rows={isMultiline ? (def.rows ?? 2) : undefined}
      type={
        def.type === 'number' ? 'number'
        : def.type === 'date' ? 'date'
        : isPhone ? 'tel'
        : 'text'
      }
      label={label}
      placeholder={def.ph ? tr[def.ph] : undefined}
      value={value}
      onChange={(e) => setField(key, e.target.value)}
      onBlur={
        def.type === 'number'
          ? () => setField(key, normalizeNumber(value, {
              min: def.min, max: def.max, allowDecimal: def.step === 'any',
            }))
          : undefined
      }
      helperText={def.helper ? tr[def.helper] : undefined}
      slotProps={{
        inputLabel: def.type === 'date' ? { shrink: true } : undefined,
        input: unitAdornment,
        htmlInput: {
          ...(inputMode ? { inputMode } : {}),
          ...(def.type === 'number'
            ? { min: def.min, max: def.max, step: def.step }
            : {}),
        },
      }}
    >
      {isSelect && [
        <MenuItem key="" value=""><em>—</em></MenuItem>,
        ...(def.opts ?? []).map((o) => (
          <MenuItem key={o.value} value={o.value}>{optLabel(o, tr)}</MenuItem>
        )),
      ]}
    </TextField>
  )
}
