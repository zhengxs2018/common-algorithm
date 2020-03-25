import { join, dirname, extname, basename } from 'path'

import nodeResolver from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

import clear from 'rollup-plugin-clear'
import progress from 'rollup-plugin-progress'
import { eslint } from 'rollup-plugin-eslint'

import externals from 'rollup-plugin-node-externals'

import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

import filesize from 'rollup-plugin-filesize'
import visualizer from 'rollup-plugin-visualizer'

import toUpper from 'lodash/toUpper'
import snakeCase from 'lodash/snakeCase'

import pkg from './package.json'

const isProd = process.env.NODE_ENV === 'production'
const analyse = process.env.npm_config_analyse

const banner = `/**
 * ${pkg.name} v${pkg.version}
 *
 * (c) ${new Date().getFullYear()} ${pkg.author.name}
 *
 * @author ${pkg.author.name}
 * @license ${pkg.license}
 */`

const config = {
  input: pkg.module,
  output: [
    {
      banner,
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  external(resolveId) {
    return /^lodash/.test(resolveId)
  },
  plugins: [
    clear({
      targets: ['dist', 'bundle-analyzer-report.html']
    }),
    progress({
      clearLine: false
    }),
    eslint(),
    replace({
      __VERSION__: pkg.version,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    externals({
      exclude: [/^lodash?/]
    }),
    nodeResolver(),
    commonjs(),
    babel({
      externalHelpers: true
    }),
    json()
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
}

if (analyse) {
  config.plugins.push(
    visualizer({
      title: `${pkg.name} - ${pkg.author.name}`,
      filename: join(__dirname, 'reports/bundle-analyzer-report.html')
    })
  )
} else {
  const pkgName = pkg.name
  const umdOutputConfig = {
    banner,
    format: 'umd',
    name: toUpper(snakeCase(basename(pkgName))),
    sourcemap: true,
    exports: 'named'
  }

  const outputFile = pkg.browser
  const ext = extname(outputFile)
  config.output.push({
    file: join(dirname(outputFile), `${basename(outputFile, ext)}.min${ext}`),
    plugins: [terser()],
    ...umdOutputConfig
  })

  config.output.push({
    file: outputFile,
    ...umdOutputConfig
  })
}

if (isProd) {
  // 添加统计插件
  config.plugins.push(filesize())
}

export default config
