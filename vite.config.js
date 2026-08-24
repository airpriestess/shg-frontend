import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  define: { __BUILD_DATE__: JSON.stringify('2026-08-24-v3') }
})