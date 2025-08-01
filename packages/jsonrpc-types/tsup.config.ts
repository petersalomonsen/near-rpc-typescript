import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    // Version-specific entries
    'src/v1.0.0/index.ts',
    'src/v1.1.0/index.ts',
    'src/v1.1.1/index.ts',
    'src/latest/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  target: 'es2022',
});