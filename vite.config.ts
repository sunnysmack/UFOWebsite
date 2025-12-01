import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Puts the API key into the process.env object for the build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})