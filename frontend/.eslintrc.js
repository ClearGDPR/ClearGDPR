module.exports = {
  extends: [
    'eslint:recommended',
    'react-app',
    'plugin:prettier/recommended',
    'plugin:jest/recommended'
  ],
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
  }
};
