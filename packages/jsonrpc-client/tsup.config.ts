import { defineConfig } from 'tsup';

export default defineConfig([
  // Regular builds (Node.js)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
  },
  // Mini builds (Node.js, using zod/mini)
  {
    entry: { 'index.mini': 'src/index.mini.ts' },
    format: ['cjs', 'esm'],
    outDir: 'dist',
    outExtension: ({ format }) => ({
      js: format === 'cjs' ? '.cjs' : '.mjs',
      dts: '.d.ts',
    }),
    dts: true,
    clean: false,
  },
]);
