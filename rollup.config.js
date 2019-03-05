import typescript from 'rollup-plugin-typescript2';
import tslint from 'rollup-plugin-tslint';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const external = (id) => !id.startsWith('.') && !id.startsWith('/');

const input = 'src/index.ts';

const buildUmd = (minify) => ({
  input,
  external: ['react'],
  output: [
    {
      name: 'formx',
      file: `./dist/index.umd${minify ? '.min.js' : '.js'}`,
      format: 'umd',
      exports: 'named',
      sourcemap: true,
      globals: {
        react: 'React'
      }
    }
  ],
  plugins: [
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs(),
    minify &&
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true
        },
        warnings: true,
        ecma: 5,
        toplevel: false
      })
  ]
});

const buildEs = {
  input,
  external,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs()
  ]
};

export default [buildUmd(true), buildUmd(false), buildEs];
