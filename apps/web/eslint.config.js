import config from '@tags/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
      },
    },
  },
];
