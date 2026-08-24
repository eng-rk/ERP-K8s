import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Keep the existing migration debt visible without blocking CI.
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-dupe-keys': 'warn',
      'no-case-declarations': 'warn',
      'no-empty': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/unsupported-syntax': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-refresh/only-export-components': 'warn',
    },
  },
])
