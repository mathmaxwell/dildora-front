import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // В dev фронт ходит на относительный /api, а Vite проксирует это на бэкенд —
  // как делает Netlify в проде. Так один и тот же код работает и там, и там.
  server: {
    proxy: {
      '/api': {
        target: 'http://194.163.144.40:8080',
        changeOrigin: true,
      },
    },
  },
})
