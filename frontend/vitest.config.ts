import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Changed to jsdom for React component testing
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    setupFiles: './src/setupTests.ts', // Enable setup for React Testing Library
  },
})
