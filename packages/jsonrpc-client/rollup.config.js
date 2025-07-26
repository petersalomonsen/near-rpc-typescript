import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
  // Browser bundle (unminified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/browser-standalone.js',
      format: 'esm',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        outputToFilesystem: true,
      }),
      nodeResolve({
        moduleDirectories: ['node_modules'],
        extensions: ['.js', '.mjs', '.ts'],
      }),
    ],
    external: [],
  },
  // Browser bundle (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/browser-standalone.min.js',
      format: 'esm',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        outputToFilesystem: true,
      }),
      nodeResolve({
        moduleDirectories: ['node_modules'],
        extensions: ['.js', '.mjs', '.ts'],
      }),
      terser(),
    ],
    external: [],
  },
];
