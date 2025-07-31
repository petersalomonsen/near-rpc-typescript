import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/no-validation/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
});
