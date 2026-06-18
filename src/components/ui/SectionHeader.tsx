import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  color: string
  icon: ReactNode
  title: string
}

export function SectionHeader({ color, icon, title }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
      <Box sx={{
        width: 42, height: 42, borderRadius: '50%',
        bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ color }}>
        {title}
      </Typography>
    </Box>
  )
}
