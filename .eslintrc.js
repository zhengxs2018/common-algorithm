'use strict'

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    ecmaFeatures: {
      generators: false,
      objectLiteralDuplicateProperties: false
    }
  }
}
