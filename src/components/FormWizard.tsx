import { useMemo, useState } from 'react'
import { Box, Button, Chip, LinearProgress, Tooltip, Typography } from '@mui/material'
import { ArrowBackRounded, ArrowForwardRounded, EditRounded, AddRounded } from '@mui/icons-material'
import { AnimatePresence, motion } from 'framer-motion'
import { GenericSection } from './sections/GenericSection'
import { LabTests } from './sections/LabTests'
import { AiAnalysis } from './AiAnalysis'
import { SaveButton } from './SaveButton'
import { useTr } from '../hooks/useTr'
import { useSectionColor } from '../hooks/useSectionColors'
import { useEditStore } from '../store/editStore'
import { SECTIONS } from '../config/formConfig'
import type { SectionDef } from '../config/formConfig'

// A single step is either one of the declarative sections or the bespoke
// lab-tests card. The lab card is slotted in right after "complaints",
// matching where it used to live in the single-page layout.
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

export function FormWizard() {
  const tr = useTr()
  const steps = useMemo(() => buildSteps(), [])
  const total = steps.length

  const { editingId, editingName, startNew } = useEditStore()

  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)

  const step = steps[index]
  const color = useSectionColor(step.id)
  const isFirst = index === 0
  const isLast = index === total - 1
  const progress = ((index + 1) / total) * 100

  const go = (next: number) => {
    if (next < 0 || next > total - 1 || next === index) return
    setDir(next > index ? 1 : -1)
    setIndex(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* ── Editing banner ── */}
      {editingId !== null && (
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 1, flexWrap: 'wrap',
            bgcolor: 'warning.light', color: 'warning.contrastText',
            borderRadius: 2, px: 1.5, py: 1,
          }}
        >
          <Chip
            icon={<EditRounded />}
            label={`${tr.editingLabel}: ${editingName}`}
            size="small"
            sx={{ bgcolor: 'rgba(0,0,0,0.12)', fontWeight: 600 }}
          />
          <Button
            size="small"
            startIcon={<AddRounded />}
            onClick={startNew}
            sx={{ fontWeight: 700, color: 'inherit' }}
          >
            {tr.newCard}
          </Button>
        </Box>
      )}

      {/* ── Progress header ── */}
      <Box>
        {/* Step dots — tap to jump to any section */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.75,
            overflowX: 'auto', pb: 1,
            '&::-webkit-scrollbar': { height: 0 },
          }}
        >
          {steps.map((s, i) => {
            const active = i === index
            const done = i < index
            return (
              <Tooltip key={s.id} title={tr[s.titleTr]} arrow>
                <Box
                  component="button"
                  onClick={() => go(i)}
                  aria-label={tr[s.titleTr]}
                  sx={{
                    flexShrink: 0,
                    width: active ? 30 : 13,
                    height: 13,
                    p: 0,
                    my: 0.5,           // taller transparent tap zone for fingers
                    border: 'none',
                    borderRadius: 7,
                    cursor: 'pointer',
                    transition: 'all .25s ease',
                    bgcolor: active || done ? color.accent : 'action.disabled',
                    opacity: done ? 0.5 : 1,
                  }}
                />
              </Tooltip>
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography variant="subtitle2" sx={{ color: color.accent, fontWeight: 700 }}>
            {tr[step.titleTr]}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 1 }}>
            {tr.wizStep} {index + 1} {tr.wizOf} {total}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6, borderRadius: 3,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': { bgcolor: color.accent, borderRadius: 3 },
          }}
        />
      </Box>

      {/* ── Active step content ── */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step.id}
          custom={dir}
          initial={{ opacity: 0, x: dir * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -60 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {step.kind === 'lab'
            ? <LabTests />
            : <GenericSection section={step.section} />}
        </motion.div>
      </AnimatePresence>

      {/* ── Final step: hint + AI analysis + save (above the sticky bar) ── */}
      {isLast && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1.5 }}>
            {tr.wizDone}
          </Typography>
          <AiAnalysis />
          <SaveButton />
        </Box>
      )}

      {/* ── Sticky navigation bar — always reachable without scrolling ── */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          mx: { xs: -2, sm: -3 },        // bleed to the container edges
          px: { xs: 2, sm: 3 },
          pt: 1.5,
          pb: 'calc(12px + env(safe-area-inset-bottom))',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: 'background.default',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid',
          borderColor: 'divider',
          zIndex: 5,
        }}
      >
        <Button
          variant="outlined"
          size="large"
          disabled={isFirst}
          onClick={() => go(index - 1)}
          startIcon={<ArrowBackRounded />}
          sx={{
            borderRadius: 3, px: 3, py: 1.2, fontWeight: 600, minHeight: 48,
            flex: isFirst ? 'unset' : 1,
            color: color.accent, borderColor: color.accent,
            '&:hover': { borderColor: color.accent, bgcolor: 'action.hover' },
          }}
        >
          {tr.navBack}
        </Button>

        {!isLast && (
          <Button
            variant="contained"
            size="large"
            onClick={() => go(index + 1)}
            endIcon={<ArrowForwardRounded />}
            sx={{
              borderRadius: 3, px: 3, py: 1.2, fontWeight: 700, minHeight: 48, flex: 2,
              bgcolor: color.accent,
              '&:hover': { bgcolor: color.accent, filter: 'brightness(0.92)' },
            }}
          >
            {tr.navNext}
          </Button>
        )}
      </Box>
    </Box>
  )
}
