module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
      },
    ], // Avoid conflict rule between Prettier and Airbnb Eslint
  },
  overrides: [
    // Configuration for TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
      plugins: [
        '@typescript-eslint',
        'unused-imports',
        'simple-import-sort',
        'import',
      ],
      extends: [
        'airbnb-base',
        'airbnb-typescript',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            endOfLine: 'auto',
          },
        ], // Avoid conflict rule between Prettier and Airbnb Eslint
        'import/extensions': 'off', // Avoid missing file extension errors, TypeScript already provides a similar feature
        '@typescript-eslint/comma-dangle': 'off', // Avoid conflict rule between Eslint and Prettier
        '@typescript-eslint/consistent-type-imports': 'error', // Ensure `import type` is used when it's necessary
        'no-restricted-syntax': [
          'error',
          'ForInStatement',
          'LabeledStatement',
          'WithStatement',
        ], // Overrides Airbnb configuration and enable no-restricted-syntax
        'import/prefer-default-export': 'off', // Named export is easier to refactor automatically
        'simple-import-sort/imports': 'error', // Import configuration for `eslint-plugin-simple-import-sort`
        'simple-import-sort/exports': 'error', // Export configuration for `eslint-plugin-simple-import-sort`
        'import/order': 'off', // Avoid conflict rule between `eslint-plugin-import` and `eslint-plugin-simple-import-sort`
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'react/jsx-filename-extension': 'off',
      },
    },
    // Configuration for testing
    // {
    //   "files": ["**/*.test.ts", "**/*.test.tsx"],
    //   "plugins": ["vitest", "jest-formatting", "testing-library", "jest-dom"],
    //   "extends": [
    //     "plugin:vitest/recommended",
    //     "plugin:jest-formatting/recommended",
    //     "plugin:jest-dom/recommended"
    //   ]
    // }
  ],
};
