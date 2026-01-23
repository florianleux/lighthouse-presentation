import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

console.log('=== VITE CONFIG DEBUG ===')
console.log('process.env.VITE_ABLY_API_KEY:', process.env.VITE_ABLY_API_KEY)

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