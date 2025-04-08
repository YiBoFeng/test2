// https://vitejs.dev/config/
import { ConfigEnv, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

declare const __dirname: string

export function defineSharedConfig({ mode }: ConfigEnv): UserConfig {
  const env = loadEnv(mode, './env')
  console.log(JSON.stringify(env, null, 2))
  return {
    plugins: [react(), tsconfigPaths()],
    envDir: __dirname + '/.env',
    publicDir: __dirname + '/public',
    base: './',
    server: {
      https: false,
      proxy: {
        '/user': env.VITE_BASE_URL,
        '/board': env.VITE_BASE_URL,
        '/integration/': env.VITE_INTEGRATION_BASE_URL,
      },
    },
  }
}