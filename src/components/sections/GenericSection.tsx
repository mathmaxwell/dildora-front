import type { ReactNode } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import {
  BadgeRounded, MonitorWeightRounded, ReportProblemRounded, WarningRounded,
  CoronavirusRounded, FemaleRounded, PregnantWomanRounded, MonitorHeartRounded,
  ChildCareRounded, VaccinesRounded, BlockRounded, RestaurantRounded, FavoriteRounded,
  ChildFriendlyRounded,
} from '@mui/icons-material'
import { SectionHeader } from '../ui/SectionHeader'
import { FieldInput } from '../ui/FieldInput'
import { CheckGroup } from '../ui/CheckGroup'
import { ComplaintList } from '../ui/ComplaintList'
import { UltrasoundTable } from '../ui/UltrasoundTable'
import { useTr } from '../../hooks/useTr'
import { useSectionColor } from '../../hooks/useSectionColors'
import type { SectionDef } from '../../config/formConfig'

const ICONS: Record<string, ReactNode> = {
  passport:      <BadgeRounded sx={{ color: 'white', fontSize: 22 }} />,
  anthro:        <MonitorWeightRounded sx={{ color: 'white', fontSize: 22 }} />,
  risk:          <ReportProblemRounded sx={{ color: 'white', fontSize: 22 }} />,
  complaint:     <WarningRounded sx={{ color: 'white', fontSize: 22 }} />,
  anamnesis:     <CoronavirusRounded sx={{ color: 'white', fontSize: 22 }} />,
  reproductive:  <FemaleRounded sx={{ color: 'white', fontSize: 22 }} />,
  obstetric:     <PregnantWomanRounded sx={{ color: 'white', fontSize: 22 }} />,
  ultrasound:    <MonitorHeartRounded sx={{ color: 'white', fontSize: 22 }} />,
  placenta:      <FavoriteRounded sx={{ color: 'white', fontSize: 22 }} />,
  delivery:      <ChildFriendlyRounded sx={{ color: 'white', fontSize: 22 }} />,
  outcome:       <ChildCareRounded sx={{ color: 'white', fontSize: 22 }} />,
  vaccine:       <VaccinesRounded sx={{ color: 'white', fontSize: 22 }} />,
  contraception: <BlockRounded sx={{ color: 'white', fontSize: 22 }} />,
  lifestyle:     <RestaurantRounded sx={{ color: 'white', fontSize: 22 }} />,
}

export function GenericSection({ section }: { section: SectionDef }) {
  const tr = useTr()
  const color = useSectionColor(section.id)

  return (
    <Card sx={{ bgcolor: color.bg }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <SectionHeader
          color={color.accent}
          icon={ICONS[section.id] ?? <BadgeRounded sx={{ color: 'white', fontSize: 22 }} />}
          title={tr[section.titleTr]}
        />

        {section.ultrasound && <UltrasoundTable accent={color.accent} />}

        {section.fields && section.fields.length > 0 && (
          <Grid container spacing={2}>
            {section.fields.map((def) => (
              <Grid key={def.id} size={{ xs: def.xs ?? 12, sm: def.sm ?? 12 }}>
                <FieldInput def={def} />
              </Grid>
            ))}
          </Grid>
        )}

        {section.checks?.map((group, i) => (
          <Grid container key={i} sx={{ mt: section.fields?.length ? 2 : 0 }}>
            <Grid size={{ xs: 12 }}>
              <CheckGroup group={group} accent={color.accent} />
            </Grid>
          </Grid>
        ))}

        {section.complaints && (
          <ComplaintList keys={section.complaints} accent={color.accent} />
        )}
      </CardContent>
    </Card>
  )
}
