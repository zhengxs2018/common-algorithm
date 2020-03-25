'use strict'

module.exports = api => {
  const isTest = api.env('test')
  const isProd = api.env('production')

  const babelConfig = {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: isTest ? 'commonjs' : false
        }
      ]
    ],
    plugins: [],
    exclude: ['node_modules']
  }

  if (isProd) {
    babelConfig.plugins.push('@babel/plugin-external-helpers')
  }

  return babelConfig
}
