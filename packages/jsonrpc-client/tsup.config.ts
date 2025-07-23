import { defineConfig } from 'tsup';

export default defineConfig([
  // Regular builds
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
  },
  // Mini builds (using zod/mini)
  {
    entry: { 'index.mini': 'src/index.mini.ts' },
    format: ['cjs', 'esm'],
    outDir: 'dist',
    outExtension: ({ format }) => ({ 
      js: format === 'cjs' ? '.cjs' : '.mjs',
      dts: '.d.ts' 
    }),
    dts: true,
    clean: false,
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
    treeshake: true,
    splitting: false,
  },
  // Minified browser bundle
  {
    entry: { 'browser-standalone.min': 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
    bundle: true,
    external: [],
    noExternal: ['@near-js/jsonrpc-types', 'zod', 'cross-fetch'],
    dts: false,
    minify: true,
    clean: false,
    treeshake: true,
    splitting: false,
  },
  // Browser bundle with zod/mini
  {
    entry: { 'browser-standalone-mini': 'src/index.mini.ts' },
    format: ['esm'],
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
    bundle: true,
    external: [],
    noExternal: ['@near-js/jsonrpc-types', 'zod', 'cross-fetch'],
    dts: false,
    minify: false,
    clean: false,
    treeshake: true,
    splitting: false,
  },
  // Minified browser bundle with zod/mini
  {
    entry: { 'browser-standalone-mini.min': 'src/index.mini.ts' },
    format: ['esm'],
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
    bundle: true,
    external: [],
    noExternal: ['@near-js/jsonrpc-types', 'zod', 'cross-fetch'],
    dts: false,
    minify: true,
    clean: false,
    treeshake: true,
    splitting: false,
  },
]);
