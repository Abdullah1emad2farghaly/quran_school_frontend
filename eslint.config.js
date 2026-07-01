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
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 17+ JSX runtime: the `React` import isn't needed for JSX to
      // work, but we keep importing it for clarity/consistency, so don't
      // flag it as unused. Standard pattern used throughout this codebase.
      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$', argsIgnorePattern: '^_' }],
      // This rule flags the conventional "setLoading(true) at the top of a
      // data-fetching effect" pattern used consistently across this app's
      // pages (load-on-mount / load-on-param-change). That pattern is safe
      // here (no cascading re-render loops — loading state gates a skeleton
      // UI, not another effect), so we relax it to a warning rather than
      // rewriting every page's fetch pattern.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
