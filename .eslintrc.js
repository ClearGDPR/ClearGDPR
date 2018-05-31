module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }], // prevent lint errors if you don't use some function arguments
    'no-console': ['off'], // I like to use the console

    'max-params': ['warn', 5],
    'max-nested-callbacks': ['warn', 5],
    'max-statements': ['warn', 20],
    'max-depth': ['warn', 7],
    'max-lines': ['warn', 750],
    'array-callback-return': 'warn',
    complexity: ['warn', { max: 20 }]
  },
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    es6: true, // otherwise you cannot use const and many other things
    node: true // otherwise we get errors for using require, process, etc.
  }
};
