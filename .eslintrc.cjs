/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        trailingComma: "all",
        arrowParens: "always",
        semi: true,
      },
    ],
    "comma-dangle": ["off", "always-multiline"],
    "vue/require-default-prop": [
      "off",
      {
        required: false,
        "non-required": false,
      },
    ],
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["App"],
      },
    ],
    semi: ["error", "always"],
  },
};
