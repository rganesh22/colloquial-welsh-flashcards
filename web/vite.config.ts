import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Expose shell / .env Gemini keys to the client (user has GEMINI_API_KEY set).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const geminiKey =
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ''

  return {
    plugins: [react()],
    base: './',
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    },
    envPrefix: ['VITE_', 'GEMINI_'],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
    },
  }
})
