module.exports = {
  root: true,

  env: {
    es2021: true,
  },

  extends: [
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
  ],

  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
      },
    },
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-underscore-dangle': 'off',
    'no-confusing-arrow': 'off',
    'no-nested-ternary': 'off',
    'consistent-return': 'off',
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'no-plusplus': 'off',
    'no-unused-expressions': ['error', { allowTernary: true }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-trailing-spaces': 'off',
    'import/prefer-default-export': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-v-html': 'off',
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     mjs: 'never',
    //     jsx: 'never',
    //     ts: 'never',
    //     tsx: 'never',
    //     vue: 'never',
    //   },
    // ],
  },

  globals: {
    echo: 'readable',
  },
};
