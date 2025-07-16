import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'node20'
  },
  test: {
    globals: true,
    environment: 'node',
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/generated/**'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
