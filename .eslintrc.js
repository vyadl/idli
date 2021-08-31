module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
    'no-confusing-arrow': 'off',
    'arrow-parens': 'off',
    'no-plusplus': 'off',
    'no-unused-expressions': ["error", { "allowTernary": true }],
    'import/no-extraneous-dependencies': ["error", {"devDependencies": false }],
    'no-use-before-define': ["error", { "functions": false, "classes": true }],
  },

  globals: {
    echo: 'readable',
  },
};
