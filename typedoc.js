const pkg = require('./package.json')

module.exports = {
  name: pkg.name,
  mode: 'modules',
  readme: './README.md',
  gitRevision: 'master',
  out: 'docs',
  inputFiles: ['./src'],
  excludePrivate: true,
  excludeExternals: true,
  excludeNotExported: true,
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/examples/**',
    '**/history/**',
    '**/*.spec.ts',
    '**/tests/**/*.ts'
  ],
  ignoreCompilerErrors: true
}
