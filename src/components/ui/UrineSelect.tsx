import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useFormStore } from '../../store/formStore'
import { useTr } from '../../hooks/useTr'
import type { StringKey } from '../../types/form'

const OPTS = ['neg', 'traces', '+', '++', '+++'] as const

interface Props {
  fieldKey: StringKey
  label: string
}

export function UrineSelect({ fieldKey, label }: Props) {
  const tr = useTr()
  const value = useFormStore((s) => s[fieldKey] as string)
  const setField = useFormStore((s) => s.setField)

  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(e) => setField(fieldKey, e.target.value)}>
        <MenuItem value=""><em>—</em></MenuItem>
        {OPTS.map((v) => (
          <MenuItem key={v} value={v}>
            {v === 'neg' ? tr.neg : v === 'traces' ? tr.traces : v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
