import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    setupFiles: './src/setupTests.ts',
    // Prevent infinite loops and timeouts
    testTimeout: 5000,
    hookTimeout: 5000,
    // Ensure proper test isolation
    isolate: true,
    // Add better compatibility for CI environments
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    // Handle jsdom compatibility issues and add test isolation
    deps: {
      optimizer: {
        web: {
          include: ['whatwg-url']
        }
      }
    }
  },
})
