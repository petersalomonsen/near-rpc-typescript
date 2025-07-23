import { defineConfig } from 'tsup'

export default defineConfig([
  // Regular build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    target: 'es2022'
  },
  // Mini build (zod/mini version)
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
    target: 'es2022'
  }
])