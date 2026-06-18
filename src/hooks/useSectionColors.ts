import { useModeStore } from '../store/modeStore'

export interface SectionColor {
  bg: string
  accent: string
}

/** A color per section id (see formConfig SECTIONS). */
export type SectionColors = Record<string, SectionColor>

const LIGHT: SectionColors = {
  passport:      { bg: '#EDE9FE', accent: '#7C3AED' },
  anthro:        { bg: '#EFF6FF', accent: '#2563EB' },
  risk:          { bg: '#FEF2F2', accent: '#DC2626' },
  complaint:     { bg: '#FFF7ED', accent: '#EA580C' },
  lab:           { bg: '#ECFDF5', accent: '#059669' },
  anamnesis:     { bg: '#FDF4FF', accent: '#C026D3' },
  reproductive:  { bg: '#FDF2F8', accent: '#DB2777' },
  obstetric:     { bg: '#F0FDFA', accent: '#0D9488' },
  ultrasound:    { bg: '#F0F9FF', accent: '#0284C7' },
  placenta:      { bg: '#FEFCE8', accent: '#CA8A04' },
  delivery:      { bg: '#FFF1F5', accent: '#BE123C' },
  outcome:       { bg: '#F0FDF4', accent: '#16A34A' },
  vaccine:       { bg: '#EEF2FF', accent: '#4F46E5' },
  contraception: { bg: '#FFF1F2', accent: '#E11D48' },
  lifestyle:     { bg: '#F7FEE7', accent: '#65A30D' },
}

const DARK: SectionColors = {
  passport:      { bg: '#1A0F40', accent: '#A78BFA' },
  anthro:        { bg: '#0A1834', accent: '#60A5FA' },
  risk:          { bg: '#2A0A0A', accent: '#F87171' },
  complaint:     { bg: '#2D1200', accent: '#FB923C' },
  lab:           { bg: '#052018', accent: '#34D399' },
  anamnesis:     { bg: '#2A0A2D', accent: '#E879F9' },
  reproductive:  { bg: '#2D0A1E', accent: '#F472B6' },
  obstetric:     { bg: '#04201C', accent: '#2DD4BF' },
  ultrasound:    { bg: '#04162A', accent: '#38BDF8' },
  placenta:      { bg: '#241F00', accent: '#FACC15' },
  delivery:      { bg: '#2A0410', accent: '#FB7185' },
  outcome:       { bg: '#052010', accent: '#4ADE80' },
  vaccine:       { bg: '#100F33', accent: '#818CF8' },
  contraception: { bg: '#2A0410', accent: '#FB7185' },
  lifestyle:     { bg: '#13200A', accent: '#A3E635' },
}

const FALLBACK_LIGHT: SectionColor = { bg: '#F4F4F5', accent: '#52525B' }
const FALLBACK_DARK: SectionColor = { bg: '#1C1C1F', accent: '#A1A1AA' }

export function useSectionColors(): SectionColors {
  const mode = useModeStore((s) => s.mode)
  return mode === 'dark' ? DARK : LIGHT
}

export function useSectionColor(id: string): SectionColor {
  const mode = useModeStore((s) => s.mode)
  const palette = mode === 'dark' ? DARK : LIGHT
  const fallback = mode === 'dark' ? FALLBACK_DARK : FALLBACK_LIGHT
  return palette[id] ?? fallback
}
