import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          arweave: ['@arweave-wallet-kit/react']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: [
      '@arweave-wallet-kit/wander-strategy',
      '@arweave-wallet-kit/browser-wallet-strategy', 
      '@arweave-wallet-kit/webwallet-strategy'
    ]
  },
  server: {
    fs: {
      strict: false
    }
  }
})