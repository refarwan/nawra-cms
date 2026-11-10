/** @type {import("prettier").Config} */
const config = {
  useTabs: false,
  singleQuote: false,
  trailingComma: "none",
  printWidth: 100,
  plugins: [
    "prettier-plugin-svelte",
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports"
  ],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
  tailwindStylesheet: "./src/routes/layout.css",
  importOrder: [
    "^\\u0000",
    "^bun(:.*)?$",
    "^node:(.*)$",
    "",
    "^svelte(/.*)?$",
    "^@sveltejs/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^\\$app/(.*)$",
    "^\\$env/(.*)$",
    "",
    "^#(.*)$",
    "^\\$lib/(.*)$",
    "^@/(.*)$",
    "",
    "^[./]",
    "",
    "<TYPES>^bun(:.*)?$",
    "<TYPES>^node:(.*)$",
    "<TYPES>^svelte(/.*)?$",
    "<TYPES>^@sveltejs/(.*)$",
    "<TYPES>",
    "<TYPES>^\\$app/(.*)$",
    "<TYPES>^\\$env/(.*)$",
    "<TYPES>^#(.*)$",
    "<TYPES>^\\$lib/(.*)$",
    "<TYPES>^[./]"
  ]
};

export default config;
