import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import json from '@eslint/json'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'

const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const prettierPlugin = require('eslint-plugin-prettier')

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { react: pluginReact },
    rules: pluginReact.configs.flat.recommended.rules,
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,json,css}'],
    plugins: { prettier: prettierPlugin },
    rules: { 'prettier/prettier': 'warn' },
    extends: ['plugin:prettier/recommended'],
  },
])
