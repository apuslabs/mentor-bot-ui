import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      '@arweave-wallet-kit/react'
    ],
    // Exclude the wallet strategies from pre-bundling since they're dynamically imported
    exclude: [
      '@arweave-wallet-kit/wander-strategy',
      '@arweave-wallet-kit/browser-wallet-strategy',
      '@arweave-wallet-kit/webwallet-strategy'
    ]
  }
})