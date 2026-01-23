import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.env.VITE_ABLY_API_KEY': JSON.stringify(process.env.VITE_ABLY_API_KEY)
  },
  server: {
    port: 3032,
    host: true,
  },
})