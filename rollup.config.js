import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
  import simplevars from 'postcss-simple-vars';
  import nested from 'postcss-nested';
import bundleSize from 'rollup-plugin-bundle-size';
import replace from '@rollup/plugin-replace';
import svgr from '@svgr/rollup';
import { DEFAULT_EXTENSIONS as DEFAULT_BABEL_EXTENSIONS } from '@babel/core';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const processEnv = isProd || isTesting ? 'production' : 'development';

//外部包 当前库依赖 需调用方自行install
const externalPkg = [
  'react', 'react-dom','react-router-dom','@ant-design/icons','antd'
]

export const baseConfig = ({ mainFile = pkg.main, moduleFile = pkg.module, injectCSS = true } = {}) => ({
  input: 'src/index.js',
  external: [...externalPkg, (id) => id.includes('@babel/runtime')],
  onwarn(warning, rollupWarn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
      rollupWarn(warning);
    }
  },
  output: [
    {
      file: mainFile,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: moduleFile,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    replace({
      __ENV__: JSON.stringify(processEnv),
      __REACT_FLOW_VERSION__: JSON.stringify(pkg.version),
      preventAssignment: true,
    }),
    bundleSize(),
    postcss({
      plugins:[
        simplevars(),
        nested(),
      ],
      minimize: isProd,
      inject: injectCSS,
    }),
    svgr(),
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      extensions: [...DEFAULT_BABEL_EXTENSIONS],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
  ],
});

export default isProd && !isTesting
  ? [
      baseConfig(),
      baseConfig({
        mainFile: 'dist/nocss/'+pkg.name+'-nocss.js',
        moduleFile: 'dist/nocss/'+pkg.name+'-nocss.esm.js',
        injectCSS: false,
      }),
    ]
  : baseConfig();
