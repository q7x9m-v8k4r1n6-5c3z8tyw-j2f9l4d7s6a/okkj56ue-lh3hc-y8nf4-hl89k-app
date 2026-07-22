import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const certificatePath = join(homedir(), '.aspnet', 'https', 'ovc-move-app.pfx')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const https = existsSync(certificatePath)
    ? {
        pfx: readFileSync(certificatePath),
        passphrase: env.VITE_HTTPS_CERT_PASSWORD,
      }
    : undefined

  return {
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '@app': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./core', import.meta.url)),
      '@plugin': fileURLToPath(new URL('./plugin', import.meta.url)),
    },
  },
  server: {
    https,
  },
  }
})
