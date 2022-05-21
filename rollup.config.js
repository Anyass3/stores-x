import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const name = pkg.name
  .replace(/^(@\S+\/)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

const production = !process.env.ROLLUP_WATCH;

// const setConfig = (namespace) => {
//   return {
//     input: `src/${namespace.slice(2)}/index.ts`,
//     output: [
//       { file: pkg.exports[namespace].import, format: 'es' },
//       { file: pkg.exports[namespace].require, format: 'umd', name },
//     ],
//     plugins: [
//       resolve({
//         browser: true,
//       }),
//       commonjs(),
//       typescript({
//         sourceMap: !production,
//         inlineSources: !production,
//       }),
//       production && terser(),
//     ],
//     watch: {
//       clearScreen: false,
//     },
//   };
// };

// const configs = Object.keys(pkg.exports).reduce((configs, namespace) => {
//   return [...configs, setConfig(namespace)];
// }, []);

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'umd', name },
    ],
    plugins: [
      resolve({
        browser: true,
      }),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  // ...configs,
];
