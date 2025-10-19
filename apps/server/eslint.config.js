import config from '@tags/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        console: 'readonly',
      },
    },
  },
];
