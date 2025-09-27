import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // Use node environment for API tests
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // Skip setup files that import DOM-related packages
    // setupFiles: './src/setupTests.ts', // Commented out to avoid jsdom issues
  },
})
