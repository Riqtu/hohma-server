import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["node_modules/", "dist/", "build/", ".env"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "no-unused-vars": "warn",
      eqeqeq: "error",
      curly: "error",
    },
  },
];
