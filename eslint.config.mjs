// Zentrale ESLint-Flat-Config des Monorepos.
// Regeln gemäß docs/development-guidelines/02-coding-standards.md;
// Modulgrenzen-/Token-Regeln (dependency-cruiser, Design-System-Lints) folgen in Phase 0.
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.output/**',
      '**/.nuxt/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    rules: {
      // NFR-040: kein any ohne dokumentierte Begründung
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // security/05 §2: v-html nur in der ArticleContent-Komponente (Lint-Ausnahme dort inline)
      'vue/no-v-html': 'error',
      'vue/multi-word-component-names': 'off',
    },
  },
  // Nuxt-Auto-Import-Umgebung: definierte Globals nicht als undef werten
  {
    files: ['apps/frontend/**/*.{ts,vue}'],
    rules: {
      'no-undef': 'off',
    },
  },
  prettier,
);
