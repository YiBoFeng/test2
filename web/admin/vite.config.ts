import { defineSharedConfig } from '../vite.config'
import { defineConfig } from 'vite'

export default defineConfig((env) => {
  return {
    ...defineSharedConfig(env),
    build: {
      outDir: '../dist/admin',
    },
  }
})
