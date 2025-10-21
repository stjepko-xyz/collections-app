import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
// add Prettier support
import prettierConfig from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // add Prettier rules
      "prettier/prettier": [
        {
          singleQuote: true,
          printWidth: 100,
          tabWidth: 2,
          semi: true,
          trailingComma: "es5",
          bracketSpacing: true,
          endOfLine: "lf",
        },
      ],
    },
  },
];

export default eslintConfig;
