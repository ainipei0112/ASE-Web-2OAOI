import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import * as reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'

export default [
    eslint.configs.recommended,
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                browser: true,
                node: true,
                es2021: true,
                jest: true,
            },
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.js', 'vite.config.js'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
            'jsx-a11y': jsxA11yPlugin,
        },
        rules: {
            ...eslintConfigPrettier.rules,
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs['jsx-runtime'].rules,
            'no-undef': 'off',
            'react/jsx-no-target-blank': 'off',
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'object-curly-newline': ['error', { multiline: true }],
            eqeqeq: ['error', 'always'],
            semi: ['error', 'never'],
        },
    },
]
