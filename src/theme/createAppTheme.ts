import { createTheme } from '@mui/material'
import type { ColorMode } from '../types/lang'

export function createAppTheme(mode: ColorMode) {
  const dark = mode === 'dark'
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#A78BFA' : '#7C3AED' },
      secondary: { main: dark ? '#F472B6' : '#DB2777' },
      background: {
        default: dark ? '#0D0720' : '#F5F3FF',
        paper: dark ? '#160D33' : '#FFFFFF',
      },
    },
    shape: { borderRadius: 16 },
    typography: { fontFamily: '"Roboto", "Inter", sans-serif' },
    components: {
      // Global resets that make the whole form behave on phones.
      MuiCssBaseline: {
        styleOverrides: {
          // Strip the native number spin buttons — they're tiny tap traps on
          // mobile and the form clamps values on blur anyway.
          'input[type=number]': { MozAppearance: 'textfield' },
          'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button':
            { WebkitAppearance: 'none', margin: 0 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: dark
              ? '0 4px 24px rgba(0,0,0,0.5)'
              : '0 4px 24px rgba(124,58,237,0.08)',
          },
        },
      },
      MuiTextField: { defaultProps: { size: 'small' } },
      MuiInputBase: {
        styleOverrides: {
          // 16px font is the magic number that stops iOS Safari from zooming
          // in every time a field is focused. Also gives a comfier touch area.
          input: {
            fontSize: 16,
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
      // Selects open a real picker on mobile; keep options tall enough to tap.
      MuiMenuItem: {
        styleOverrides: {
          root: { minHeight: 44, fontSize: 16 },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          // Bigger hit area for checkbox-heavy sections (risk factors, etc.).
          root: { padding: 9 },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: { marginLeft: -9 },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 44,
            fontSize: 15,
          },
        },
      },
    },
  })
}
