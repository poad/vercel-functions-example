import { defineConfig, includeIgnoreFile } from "eslint/config"
import eslint from "@eslint/js"
import { parser, configs } from "typescript-eslint"

import solid from "eslint-plugin-solid/configs/typescript"

import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      "**/*.d.ts",
      "*.{js,jsx}",
      "src/tsconfig.json",
      "src/stories",
      "**/*.css",
      "node_modules/**/*",
      "dist",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [eslint.configs.recommended, configs.strict],
    rules: {
      "@typescript-eslint/unified-signatures": "off",
    },
  },
)
