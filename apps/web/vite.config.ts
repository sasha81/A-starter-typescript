
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'



export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  envDir: './src/envs',
  preview: {
    port: 8089,
    strictPort: true,
   },
   server: {
    port: 8089,
    strictPort: true,
    host:'0.0.0.0',
  //  origin: "http://0.0.0.0:8089",
   },
  test: {
    globals: true,
   // environment: 'happy-dom',
    environment: 'jsdom',
    setupFiles: ["./setupTest.ts"],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  }
  
})