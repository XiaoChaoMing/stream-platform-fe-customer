import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginTailwindCSS from "eslint-plugin-tailwindcss";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      tailwindcss: pluginTailwindCSS,
      "unused-imports": pluginUnusedImports,
      import: pluginImport
    },
    rules: {
      "tailwindcss/no-custom-classname": "off",

      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],

      "react/react-in-jsx-scope": "off",

      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"]
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ],
      indent: ["error", 2, { SwitchCase: 1 }],

      quotes: ["error", "single", { avoidEscape: true }],

      semi: ["error", "never"]
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "clsx", "cva"],
        config: "./tailwind.config.js",
        whitelist: ["ph", "ph-"]
      },
      react: {
        version: "detect"
      }
    }
  }
];
