module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    // enable additional rules
    'no-unused-vars': 'warn',
  },

  ignorePatterns: ['*.cjs', '*.ts'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
