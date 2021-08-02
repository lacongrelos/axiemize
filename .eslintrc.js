const prettierOptions = require('./.prettierrc')

const [OFF, WARNING, ERROR] = [0, 1, 2]

module.exports = {
  env: {
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['no-only-tests', 'prettier', 'jest', 'prefer-arrow'],
  rules: {
    'jest/no-large-snapshots': [ERROR, { maxSize: 1200 }],
    'prefer-arrow/prefer-arrow-functions': [
      ERROR,
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    'no-console': OFF,
    'no-debugger': ERROR,
    'no-nested-ternary': WARNING,
    'no-only-tests/no-only-tests': ERROR,
    'no-unused-expressions': WARNING,
    // Some overwrites from Airbnb
    'comma-dangle': [
      ERROR,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        functions: 'never',
      },
    ],
    'prettier/prettier': [ERROR, prettierOptions],
  },
}
