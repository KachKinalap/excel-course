module.exports = {
  parserOptions: {
    babelOptions: {
      configFile: './babel.config.json'
    }
  },
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'google'],
  rules: {
    'semi': 'off',
    'comma-dangle': 'off',
    'require-jsdoc': 'off',
    'max-len': 'off',
    'linebreak-style': 'off'
  }
}
