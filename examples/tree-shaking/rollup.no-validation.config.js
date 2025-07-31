import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'main-no-validation.ts',
  output: {
    file: 'dist/bundle-no-validation.js',
    format: 'esm',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  treeshake: {
    moduleSideEffects: false,
  },
  external: [], // Bundle everything to see the tree-shaking effect
};