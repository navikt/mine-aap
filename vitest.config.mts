import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['vitestSetup.tsx'],
    exclude: [...configDefaults.exclude, './playwright-tests/**'],
  },
  resolve: {
    tsconfigPaths: true,
  },
});
