import { useMemo, useState } from 'react'
import {
  Box, Button, Chip, LinearProgress, Tooltip, Typography, IconButton,
  Drawer, List, ListItemButton, ListItemText, ListItemIcon, Snackbar, Alert,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBackRounded, ArrowForwardRounded, EditRounded, AddRounded,
  FormatListBulletedRounded, CheckCircleRounded, RadioButtonUncheckedRounded,
  SaveRounded, CheckRounded, CloseRounded,
} from '@mui/icons-material'
import { AnimatePresence, motion } from 'framer-motion'
import { GenericSection } from './sections/GenericSection'
import { LabTests } from './sections/LabTests'
import { AiAnalysis } from './AiAnalysis'
import { useTr } from '../hooks/useTr'
import { useSectionColor } from '../hooks/useSectionColors'
import { useEditStore } from '../store/editStore'
import { useFormStore } from '../store/formStore'
import { useSaveCard } from '../hooks/useSaveCard'
import { SECTIONS, US_ROWS } from '../config/formConfig'
import type { SectionDef } from '../config/formConfig'
import type { FormState } from '../types/form'

type Step =
  | { id: string; titleTr: string; kind: 'section'; section: SectionDef }
  | { id: 'lab'; titleTr: string; kind: 'lab' }

function buildSteps(): Step[] {
  const steps: Step[] = []
  for (const section of SECTIONS) {
    steps.push({ id: section.id, titleTr: section.titleTr, kind: 'section', section })
    if (section.id === 'complaint') {
      steps.push({ id: 'lab', titleTr: 's3', kind: 'lab' })
    }
  }
  return steps
}

const LAB_KEYS: (keyof FormState)[] = [
  'hgb', 'rbc', 'wbc', 'plt', 'glcBlood', 'ferritin', 'iron', 'alt', 'ast',
  'creatinine', 'protein', 'glcUrine', 'ketones',
]

/** Заполнено ли значение поля (строка/чекбокс/жалоба/УЗИ). */
function valFilled(v: unknown): boolean {
  if (typeof v === 'string') return v.trim() !== ''
  if (typeof v === 'boolean') return v
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    if ('checked' in o) return !!o.checked || (typeof o.note === 'string' && o.note.trim() !== '')
    if ('t1' in o) return `${o.t1 ?? ''}`.trim() !== '' || `${o.t2 ?? ''}`.trim() !== ''
  }
  return false
}

/** Есть ли в шаге хоть какие-то заполненные данные. */
function stepFilled(step: Step, f: FormState): boolean {
  if (step.kind === 'lab') return LAB_KEYS.some((k) => valFilled(f[k]))
  const s = step.section
  for (const def of s.fields ?? []) {
    if (def.id === 'bmi') continue
    if (def.id === 'bp') { if (f.bpSystolic || f.bpDiastolic) return true; continue }
    if (valFilled(f[def.id as keyof FormState])) return true
  }
  for (const g of s.checks ?? []) if (g.keys.some((k) => f[k])) return true
  for (const c of s.complaints ?? []) if (valFilled(f[c])) return true
  if (s.ultrasound && US_ROWS.some((r) => valFilled(f[r.id as keyof FormState]))) return true
  return false
}

export function FormWizard() {
  const tr = useTr()
  const steps = useMemo(() => buildSteps(), [])
  const total = steps.length

  const { editingId, editingName, startNew } = useEditStore()
  const { status, errorMsg, editing, save, reset: resetSave } = useSaveCard()

  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filled, setFilled] = useState<Set<string>>(new Set())

  const step = steps[index]
  const color = useSectionColor(step.id)
  const isFirst = index === 0
  const isLast = index === total - 1
  const progress = ((index + 1) / total) * 100

  const saving = status === 'saving'
  const saved = status === 'ok'

  const go = (next: number) => {
    if (next < 0 || next > total - 1 || next === index) return
    setDir(next > index ? 1 : -1)
    setIndex(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openDrawer = () => {
    // Снимок формы на момент открытия — без подписки на каждый ввод.
    const f = useFormStore.getState()
    const set = new Set<string>()
    steps.forEach((s) => { if (stepFilled(s, f)) set.add(s.id) })
    setFilled(set)
    setDrawerOpen(true)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* ── Editing banner ── */}
      {editingId !== null && (
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 1, flexWrap: 'wrap',
          bgcolor: 'warning.light', color: 'warning.contrastText',
          borderRadius: 2, px: 1.5, py: 1,
        }}>
          <Chip icon={<EditRounded />} label={`${tr.editingLabel}: ${editingName}`} size="small"
            sx={{ bgcolor: 'rgba(0,0,0,0.12)', fontWeight: 600 }} />
          <Button size="small" startIcon={<AddRounded />} onClick={startNew}
            sx={{ fontWeight: 700, color: 'inherit' }}>
            {tr.newCard}
          </Button>
        </Box>
      )}

      {/* ── Progress header ── */}
      <Box>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 0.75,
          overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 0 },
        }}>
          {steps.map((s, i) => {
            const active = i === index
            const done = i < index
            return (
              <Tooltip key={s.id} title={tr[s.titleTr]} arrow>
                <Box component="button" onClick={() => go(i)} aria-label={tr[s.titleTr]}
                  sx={{
                    flexShrink: 0, width: active ? 30 : 13, height: 13, p: 0, my: 0.5,
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    transition: 'all .25s ease',
                    bgcolor: active || done ? color.accent : 'action.disabled',
                    opacity: done ? 0.5 : 1,
                  }} />
              </Tooltip>
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            <Tooltip title={tr.sectionsButton}>
              <IconButton size="small" onClick={openDrawer} sx={{ color: color.accent, mr: 0.25 }}>
                <FormatListBulletedRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle2" noWrap sx={{ color: color.accent, fontWeight: 700 }}>
              {tr[step.titleTr]}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
            {index + 1} {tr.wizOf} {total}
          </Typography>
        </Box>

        <LinearProgress variant="determinate" value={progress}
          sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': { bgcolor: color.accent, borderRadius: 3 } }} />
      </Box>

      {/* ── Active step content ── */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step.id} custom={dir}
          initial={{ opacity: 0, x: dir * 60 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -60 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
          {step.kind === 'lab' ? <LabTests /> : <GenericSection section={step.section} />}
        </motion.div>
      </AnimatePresence>

      {/* ── Final step: hint + AI analysis ── */}
      {isLast && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1.5 }}>
            {tr.wizDone}
          </Typography>
          <AiAnalysis />
        </Box>
      )}

      {/* ── Sticky navigation bar: back · save (всегда) · next ── */}
      <Box sx={{
        position: 'sticky', bottom: 0, mx: { xs: -2, sm: -3 }, px: { xs: 2, sm: 3 },
        pt: 1.5, pb: 'calc(12px + env(safe-area-inset-bottom))',
        display: 'flex', alignItems: 'center', gap: 1.25,
        bgcolor: 'background.default', backdropFilter: 'blur(8px)',
        borderTop: '1px solid', borderColor: 'divider', zIndex: 5,
      }}>
        <Tooltip title={tr.navBack}>
          <span>
            <IconButton disabled={isFirst} onClick={() => go(index - 1)}
              sx={{ border: '1px solid', borderColor: isFirst ? 'divider' : color.accent,
                color: color.accent, borderRadius: 2.5, width: 48, height: 48 }}>
              <ArrowBackRounded />
            </IconButton>
          </span>
        </Tooltip>

        <Button variant="contained" onClick={save} disabled={saving}
          startIcon={saving ? <CircularProgress size={18} color="inherit" />
            : saved ? <CheckRounded /> : <SaveRounded />}
          sx={{
            flex: 1, borderRadius: 2.5, py: 1.2, fontWeight: 700, minHeight: 48,
            bgcolor: saved ? 'success.main' : 'primary.main',
            '&:hover': { bgcolor: saved ? 'success.main' : 'primary.main', filter: 'brightness(0.95)' },
          }}>
          {saving ? tr.saveSaving : saved ? (editing ? tr.updateSuccess : tr.saveSuccess)
            : editing ? tr.saveUpdate : tr.saveButton}
        </Button>

        {!isLast && (
          <Button variant="outlined" onClick={() => go(index + 1)}
            endIcon={<ArrowForwardRounded />}
            sx={{ flex: 1, borderRadius: 2.5, py: 1.2, fontWeight: 700, minHeight: 48,
              color: color.accent, borderColor: color.accent,
              '&:hover': { borderColor: color.accent, bgcolor: 'action.hover' } }}>
            {tr.navNext}
          </Button>
        )}
      </Box>

      {/* ── Sections drawer ── */}
      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '75vh' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>{tr.sectionsButton}</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small"><CloseRounded /></IconButton>
        </Box>
        <List sx={{ pb: 'env(safe-area-inset-bottom)' }}>
          {steps.map((s, i) => {
            const isFilledStep = filled.has(s.id)
            return (
              <ListItemButton key={s.id} selected={i === index}
                onClick={() => { go(i); setDrawerOpen(false) }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {isFilledStep
                    ? <CheckCircleRounded sx={{ color: 'success.main' }} />
                    : <RadioButtonUncheckedRounded sx={{ color: 'action.disabled' }} />}
                </ListItemIcon>
                <ListItemText primary={`${i + 1}. ${tr[s.titleTr]}`}
                  primaryTypographyProps={{ fontWeight: i === index ? 700 : 500 }} />
              </ListItemButton>
            )
          })}
        </List>
      </Drawer>

      {/* ── Save feedback ── */}
      <Snackbar open={saved} autoHideDuration={3000} onClose={resetSave}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          {editing ? tr.updateSuccess : tr.saveSuccess}
        </Alert>
      </Snackbar>
      <Snackbar open={status === 'error'} autoHideDuration={5000} onClose={resetSave}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {tr.saveError}{errorMsg ? `: ${errorMsg}` : ''}
        </Alert>
      </Snackbar>
    </Box>
  )
}
