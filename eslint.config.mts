import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

import pluginImport from 'eslint-plugin-import'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    rules: {
      semi: ['error', 'never'],
      'prettier/prettier': 'error',

      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],

      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],

      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '~/domain/commons/**', group: 'internal', position: 'before' },
            { pattern: '~/domain/**/value-objects/**', group: 'internal', position: 'before' },
            { pattern: '~/domain/**/entities/**', group: 'internal', position: 'before' },
            { pattern: '~/domain/**', group: 'internal', position: 'before' },

            { pattern: '~/application/repositories/**', group: 'internal', position: 'before' },
            { pattern: '~/application/use-cases/**', group: 'internal', position: 'before' },
            { pattern: '~/application/**', group: 'internal', position: 'before' },

            { pattern: '~/adapters/controllers/**', group: 'internal', position: 'before' },
            { pattern: '~/adapters/gateways/**', group: 'internal', position: 'before' },
            { pattern: '~/adapters/presenters/**', group: 'internal', position: 'before' },
            { pattern: '~/adapters/**', group: 'internal', position: 'before' },

            { pattern: '~/infra/database/**', group: 'internal', position: 'before' },
            { pattern: '~/infra/external/**', group: 'internal', position: 'before' },
            { pattern: '~/infra/**', group: 'internal', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'external'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Usage of relative parent imports is not allowed.',
            },
          ],
        },
      ],
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },

    extends: ['js/recommended', configPrettier],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
])
