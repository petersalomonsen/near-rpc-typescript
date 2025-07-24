import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'main-with-validation.ts',
  output: {
    file: 'dist/bundle-with-validation.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: [],
};