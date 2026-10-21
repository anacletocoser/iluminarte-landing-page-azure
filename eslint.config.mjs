import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", ".cache/**", "dist/**", "build/**", "coverage/**"],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.js", "**/*.mjs"],
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["script.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.browser,
    },
  },
];
