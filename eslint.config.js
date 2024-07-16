// @ts-check

// @ts-ignore
import eslint from '@eslint/js';
// @ts-ignore
import solid from 'eslint-plugin-solid';
import tseslint from 'typescript-eslint';
import stylisticJsx from '@stylistic/eslint-plugin-jsx';
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default tseslint.config(
  {
    ignores: ['node_modules', '.vercel', 'dist', '*.js', '*.d.ts'],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'api/**/*.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
    },
  },
  {
    plugins: {
      solid,
      '@stylistic/jsx': stylisticJsx,
      '@stylistic/ts': stylisticTs,
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
    rules: {
      '@stylistic/jsx/jsx-indent': ['error', 2],
      '@stylistic/ts/indent': ['error', 2],
      '@typescript-eslint/ban-ts-comment': ['off'],
    },
  }
);
