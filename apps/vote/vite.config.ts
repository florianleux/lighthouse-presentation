import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  // Only override env in production (for Netlify), let Vite handle .env in dev
  define: mode === 'production' && process.env.VITE_ABLY_API_KEY
    ? { 'import.meta.env.VITE_ABLY_API_KEY': JSON.stringify(process.env.VITE_ABLY_API_KEY) }
    : {},
  server: {
    port: 3032,
    host: true,
  },
}))