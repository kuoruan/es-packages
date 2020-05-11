module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "plugin:prettier/recommended",
    "plugin:import/typescript",
    "plugin:import/recommended",
  ],
  rules: {
    "no-var": "error",
    "prefer-const": "error",
    "tsdoc/syntax": "warn",
    "sort-imports": [
      "error",
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        // eslint-import-plugin will do this
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc", caseInsensitive: false },
        "newlines-between": "always",
      },
    ],
    "import/dynamic-import-chunkname": [
      "error",
      {
        importFunctions: ["dynamicImport"],
        webpackChunknameFormat: "[a-zA-Z0-57-9-/_]+",
      },
    ],
  },
  overrides: [
    {
      files: "packages/**/*.d.ts",
      rules: {
        "import/default": "off",
      },
    },
  ],
  plugins: ["@typescript-eslint", "prettier", "import", "tsdoc"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
};
