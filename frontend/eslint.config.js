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
      // TODO(FRONT-02 / audit perf): ces 2 règles sont temporairement en
      // "warn" (pas "off") pour ne pas bloquer le CI, le temps de traiter
      // les 6 occurrences de setState-in-effect (préremplissage de
      // formulaires, chargement de données) et le useMemo de Seances.jsx
      // pendant l'audit de performance/qualité de code (compétence 4.2).
      // Ne pas les repasser en "error" sans avoir corrigé les occurrences
      // listées dans le rapport d'audit (FRONT-02).
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/use-memo': 'warn',
    },
  },
])