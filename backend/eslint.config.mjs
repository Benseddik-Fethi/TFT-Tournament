import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            'no-unused-vars': 'off', // Use TypeScript version instead
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-undef': 'off', // TypeScript handles this
        },
    },
    {
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': 'off',
        },
    },
    {
        ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.mjs'],
    },
];