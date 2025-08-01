import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/no-validation/index.ts',
    // Version-specific entries
    'src/v1.0.0/index.ts',
    'src/v1.0.0/no-validation/index.ts',
    'src/v1.1.0/index.ts',
    'src/v1.1.0/no-validation/index.ts',
    'src/v1.1.1/index.ts',
    'src/v1.1.1/no-validation/index.ts',
    'src/latest/index.ts',
    'src/latest/no-validation/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
});
