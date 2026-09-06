import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    ignores: ["**/dist/**", "**/.svelte-kit/**", "**/build/**", "**/coverage/**", "**/.stryker-tmp/**", "**/reports/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      // Números em template são sempre seguros; a regra segue pegando objetos/undefined.
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  // Arquivos de config fora de tsconfig: lint sem type-check (tsc/oxlint já cobrem sintaxe).
  {
    files: ["**/*.config.js", "**/*.config.ts", "**/vitest.config.ts"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
