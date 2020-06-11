module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        '#': 'prettier config in here :)',
        singleQuote: true,
        printWidth: 100
      }
    ]
  }
};
