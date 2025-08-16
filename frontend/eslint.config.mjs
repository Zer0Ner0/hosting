// eslint.config.mjs — flat config, no eslint-config-next
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  // ignore build/output
  { ignores: [".next/**", "node_modules/**", "dist/**", "public/**"] },

  // JS base
  js.configs.recommended,

  // TS base (type-aware)
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: "./tsconfig.json" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "unused-imports/no-unused-imports": "error",
      "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }],
      "import/no-extraneous-dependencies": [
        "error",
        { devDependencies: ["**/*.config.*", "**/*.test.*"] },
      ],
    },
    settings: { react: { version: "detect" } },
  },
];
