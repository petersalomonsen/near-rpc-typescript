import { defineConfig } from 'tsup';

export default defineConfig([
  // Regular builds
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
  },
  // Browser bundle with all dependencies included
  {
    entry: { 'browser-standalone': 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
    bundle: true,
    external: [],
    noExternal: ['@near-js/jsonrpc-types', 'zod', 'cross-fetch'],
    dts: false,
    minify: false,
    clean: false,
  },
]);
