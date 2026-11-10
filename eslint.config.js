import path from "node:path";

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import checkFile from "eslint-plugin-check-file";
import svelte from "eslint-plugin-svelte";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  prettier,
  svelte.configs.prettier,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off"
    }
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser
      }
    }
  },
  {
    // Override or add rule settings here, such as:
    // 'svelte/button-has-type': 'error'
    rules: {}
  },
  {
    files: ["src/**/*.{js,ts,svelte}"],
    ignores: ["src/**/i18n/**"],
    plugins: {
      "check-file": checkFile
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/**/!(\\+*).svelte": "PASCAL_CASE",
          "src/**/!(\\+*).{ts,js}": "KEBAB_CASE",
          "src/**/\\+*.svelte": "[+](page|layout|error)*(@*([a-zA-Z0-9_-]))",
          "src/**/\\+*.{ts,js}": "[+](page|layout|server)*(@*([a-zA-Z0-9_-]))"
        },
        {
          ignoreMiddleExtensions: true
        }
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          // Mendukung kebab-case, route groups (group), dynamic [param], rest [...param], optional [[param]], matcher [param=int]
          "src/**/":
            "@(+([a-z0-9])*(-+([a-z0-9]))|\\(+([a-z0-9])*(-+([a-z0-9]))\\)|\\[*([a-zA-Z0-9_.=-])\\]|\\[\\[*([a-zA-Z0-9_.=-])\\]\\])"
        }
      ]
    }
  },
  {
    files: ["src/**/i18n/**/*.{ts,js}"],
    plugins: {
      "check-file": checkFile
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,js}": "+([a-z])*([a-z0-9])*(-+([a-zA-Z0-9]))"
        },
        {
          ignoreMiddleExtensions: true
        }
      ]
    }
  }
);
