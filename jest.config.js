// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const path = require('path')
const pkg = require('./package.json')

module.exports = {
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: pkg.name,
        outputPath: path.join(__dirname, 'reports/jest-reports.html')
      }
    ]
  ]
}
